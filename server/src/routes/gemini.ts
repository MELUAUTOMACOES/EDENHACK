// server/src/routes/gemini.ts
import { Hono } from 'hono';
import { db } from '../db/drizzle.js';
import { chatMessages } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

// Guardrails: persona e regras (Português)
const SYSTEM_PROMPT = `Você é o Adan AI, assistente agrícola do Éden.
Objetivo: orientar produtores com dicas práticas sobre manejo, irrigação, pragas, clima e boas práticas agrícolas.

Regras de comportamento:
- Responda SEMPRE em português do Brasil.
- Seja breve, clara, organizada (use listas quando útil) e prática.
- Se o usuário pedir algo fora de agricultura ou que envolva riscos, leis, medicina, finanças ou instruções perigosas, recuse gentilmente e redirecione para temas agrícolas.
- Não invente dados. Se não souber, diga que não tem certeza e sugira caminhos confiáveis.
- Incentive segurança no trabalho rural e uso responsável de insumos.
- Use emojis para ilustrar sua resposta.
- Caso o usuário diga uma palavra estranha, confirme com ele o que quer dizer, dê duas opções.
`;

// Tópicos proibidos simples (checagem local)
const FORBIDDEN_TOPICS = [
  /armas?|explosivo|bomba|fabricar subst/i,
  /hack(e|ear)|invadir sistema|burlar/i,
  /ilegal|fraude|pirat/i,
  /autoles(i|ã)on|suic[ií]dio/i,
];

const MAX_PROMPT_CHARS = 1500;

const gemini = new Hono();

// POST /api/gemini/chat
gemini.post('/chat', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({} as any));
    const prompt = body?.prompt as string | undefined;
    const sessionId = (body?.sessionId as string | undefined) || c.req.header('x-session-id') || '';

    if (!process.env.GEMINI_API_KEY) {
      return c.json({ error: 'AI unavailable: missing GEMINI_API_KEY' }, 503);
    }
    if (!prompt?.trim()) {
      return c.json({ error: "Campo 'prompt' é obrigatório" }, 400);
    }

    if (!sessionId) {
      return c.json({ error: 'Sessão inválida. Recarregue a página e tente novamente.' }, 400);
    }

    const cleanPrompt = prompt.trim();
    if (cleanPrompt.length > MAX_PROMPT_CHARS) {
      return c.json({ error: `Seu texto é muito longo (>${MAX_PROMPT_CHARS} caracteres). Resuma e tente novamente.` }, 413);
    }

    // Checagem simples de temas proibidos (antes de chamar a IA)
    if (FORBIDDEN_TOPICS.some((re) => re.test(cleanPrompt))) {
      return c.json({
        error:
          'Não posso ajudar com esse assunto. Posso orientar sobre irrigação, manejo, pragas, clima, solo e boas práticas agrícolas.'
      }, 400);
    }

    const MODEL = 'gemini-1.5-flash'; // modelo estável
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    // Carrega histórico recente desta sessão (últimas 15 mensagens)
    const history = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt))
      .limit(15);

    const contents = [
      ...history.map((m) => ({ role: m.role as 'user' | 'model', parts: [{ text: m.content }] })),
      { role: 'user' as const, parts: [{ text: cleanPrompt }] },
    ];

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY as string,
      },
      body: JSON.stringify({
        // Guardrails do lado do modelo
        systemInstruction: {
          role: 'system',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
        generationConfig: {
          temperature: 0.6,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 800,
          responseMimeType: 'text/plain',
        },
        contents,
      }),
    });

    if (!resp.ok) {
      const errJson = await resp.json().catch(async () => ({ raw: await resp.text().catch(() => '') }));
      const msg = (errJson as any)?.error?.message || (errJson as any)?.raw || 'Erro na API Gemini';
      console.error('[gemini] API error:', resp.status, msg);
      return c.json({ error: msg }, resp.status);
    }

    const data = (await resp.json()) as any;
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sem resposta';

    // Persiste as mensagens no histórico
    await db.insert(chatMessages).values([
      { sessionId, role: 'user', content: cleanPrompt },
      { sessionId, role: 'model', content: reply },
    ]);

    return c.json({ reply });
  } catch (e: any) {
    console.error('[gemini] internal error:', e?.message || e);
    return c.json({ error: `Erro interno ao chamar Gemini: ${e?.message || 'desconhecido'}` }, 500);
  }
});

// POST /api/gemini/transcribe - Transcreve áudio usando Gemini
gemini.post('/transcribe', async (c) => {
  try {
    const formData = await c.req.formData();
    const audioFile = formData.get('audio') as File | null;
    const sessionId = formData.get('sessionId') as string | null;

    if (!process.env.GEMINI_API_KEY) {
      return c.json({ error: 'AI unavailable: missing GEMINI_API_KEY' }, 503);
    }

    if (!audioFile) {
      return c.json({ error: 'Arquivo de áudio é obrigatório' }, 400);
    }

    // Converte áudio para base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');
    
    // Ajusta mime type para formato aceito pelo Gemini
    let mimeType = audioFile.type || 'audio/webm';
    if (mimeType.includes(';')) {
      mimeType = mimeType.split(';')[0]; // Remove codecs info
    }

    const MODEL = 'gemini-1.5-flash'; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    // Log para debug
    console.log('[gemini] transcribing audio, size:', audioFile.size, 'type:', mimeType, 'base64 length:', base64Audio.length);

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Audio,
              },
            },
            {
              text: 'Transcreva o áudio acima para texto em português brasileiro. Retorne apenas o texto transcrito.',
            },
          ],
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!resp.ok) {
      const errJson = await resp.json().catch(async () => ({ raw: await resp.text().catch(() => '') }));
      const msg = (errJson as any)?.error?.message || 'Erro ao transcrever áudio';
      console.error('[gemini] transcription error:', resp.status, msg);
      return c.json({ error: msg }, resp.status);
    }

    const data = (await resp.json()) as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) {
      return c.json({ error: 'Não foi possível transcrever o áudio' }, 400);
    }

    return c.json({ text: text.trim() });
  } catch (e: any) {
    console.error('[gemini] transcription internal error:', e?.message || e);
    return c.json({ error: `Erro ao processar áudio: ${e?.message || 'desconhecido'}` }, 500);
  }
});

export default gemini;
