// Gera/recupera um sessionId persistente no navegador para manter o contexto de conversa
function getChatSessionId(): string {
  const key = 'eden_chat_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `sess-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export async function askGemini(prompt: string) {
  const sessionId = getChatSessionId();
  const res = await fetch("/api/gemini/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
    body: JSON.stringify({ prompt, sessionId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Erro: ${res.status}`);
  }

  return res.json() as Promise<{ reply: string }>;
}