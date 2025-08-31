import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mic, Send, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { askGemini } from "@/services/gemini"; // <-- usa sua API
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { transcribeAudio } from "@/services/audio";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";

// UUID helper com fallback para ambientes que não possuem crypto.randomUUID
function uuid(): string {
  const g: any = globalThis as any;
  if (g?.crypto?.randomUUID) return g.crypto.randomUUID();
  if (g?.crypto?.getRandomValues) {
    const buf = new Uint8Array(16);
    g.crypto.getRandomValues(buf);
    // version 4
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const b = Array.from(buf, (x) => x.toString(16).padStart(2, "0"));
    return `${b[0]}${b[1]}${b[2]}${b[3]}-${b[4]}${b[5]}-${b[6]}${b[7]}-${b[8]}${b[9]}-${b[10]}${b[11]}${b[12]}${b[13]}${b[14]}${b[15]}`;
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Renderizador simples e seguro de Markdown (apenas **negrito**)
function mdToHtmlSafe(input: string): string {
  // Escapa HTML para evitar XSS
  const escaped = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  // Converte **texto** em <strong>texto</strong>
  // Uso não guloso para capturar o mínimo entre pares de **
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  return withBold;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatIA = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou seu assistente virtual do Éden. Como posso ajudar você hoje com sua plantação?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { isRecording, audioBlob, toggleRecording, clearAudio } = useAudioRecorder();
  const { toggleSpeak, isSpeaking } = useTextToSpeech();

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function sendMessage() {
    const text = inputValue.trim();
    if (!text || isSending) return;

    // 1) Empurra a mensagem do usuário
    const userMsg: Message = {
      id: uuid(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // 2) Coloca um placeholder "digitando…" pro assistente
    const typingId = uuid();
    const typingMsg: Message = {
      id: typingId,
      text: "Digitando…",
      isUser: false,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, typingMsg]);

    setIsSending(true);
    try {
      // 3) Chama a API do seu backend (Gemini)
      const { reply } = await askGemini(text);

      // 4) Substitui o placeholder pela resposta real
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                text: reply || "Não recebi conteúdo do modelo.",
                timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              }
            : m
        )
      );
    } catch (err: any) {
      // Mostra erro no lugar do placeholder
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                text:
                  "⚠️ Erro ao consultar a IA. " +
                  (err?.message || "Tente novamente em instantes."),
                timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  }

  // Transcreve áudio quando a gravação terminar
  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleAudioTranscription();
    }
  }, [audioBlob, isRecording]);

  async function handleAudioTranscription() {
    if (!audioBlob) return;
    
    setIsTranscribing(true);
    try {
      const text = await transcribeAudio(audioBlob);
      if (text) {
        setInputValue(text);
        // Envia automaticamente após transcrição
        setTimeout(() => {
          const trimmedText = text.trim();
          if (trimmedText) {
            sendMessage();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Erro na transcrição:', error);
      alert('Erro ao transcrever o áudio. Tente novamente.');
    } finally {
      setIsTranscribing(false);
      clearAudio();
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background pb-20 md:pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-3 md:p-4 shadow-soft shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
            <MessageCircle size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-roboto font-bold">Adan AI</h1>
            <p className="text-white/90 font-lato text-xs md:text-sm">
              Assistente especializada em agricultura
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4 pb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <Card
              className={`max-w-[85%] md:max-w-[80%] ${
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-card shadow-card border-eden-green/20"
              }`}
            >
              <CardContent className="p-2.5 md:p-3">
                <p
                  className="font-lato text-xs md:text-sm leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: mdToHtmlSafe(message.text) }}
                />
                <div className="flex items-center justify-between mt-1.5 md:mt-2">
                  <span
                    className={`text-xs ${
                      message.isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp}
                  </span>
                  {!message.isUser && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 md:h-6 md:w-6 p-0 hover:bg-secondary/50"
                      title={isSpeaking ? "Parar áudio" : "Ouvir resposta"}
                      onClick={() => toggleSpeak(message.text)}
                    >
                      <Volume2 size={10} className={`md:w-3 md:h-3 ${isSpeaking ? "text-primary animate-pulse" : ""}`} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="p-2 md:p-4 pt-0 shrink-0">
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 md:pb-2">
          {["Como irrigar milho?", "Solo muito seco", "Pragas na plantação", "Melhor época plantar"].map(
            (suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-xs font-lato h-7 md:h-8 px-2 md:px-3"
                onClick={() => {
                  setInputValue(suggestion);
                  // opcional: já enviar ao clicar
                  // setTimeout(sendMessage, 0);
                }}
              >
                {suggestion}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-2 md:p-4 bg-background border-t border-border shrink-0 relative z-50 pb-[env(safe-area-inset-bottom)] md:pb-4">
        <div className="flex items-center gap-1.5 md:gap-2">
          <Button
            variant={isRecording ? "destructive" : isTranscribing ? "secondary" : "outline"}
            size="icon"
            onClick={toggleRecording}
            disabled={isTranscribing || isSending}
            className="shrink-0 h-9 w-9 md:h-10 md:w-10"
            title={isRecording ? "Parar gravação" : isTranscribing ? "Transcrevendo..." : "Gravar áudio"}
          >
            <Mic size={16} className={`md:w-[18px] md:h-[18px] ${isRecording ? "animate-pulse" : ""}`} />
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isTranscribing ? "Transcrevendo áudio..." : "Digite sua pergunta..."}
            className="flex-1 font-lato h-9 md:h-10 text-sm"
            disabled={isTranscribing || isSending}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isSending}
            className="shrink-0 bg-eden-green hover:bg-eden-green/90 h-9 w-9 md:h-10 md:w-10 p-0"
            title="Enviar"
          >
            <Send size={16} className="md:w-[18px] md:h-[18px]" />
          </Button>
        </div>

        {(isRecording || isTranscribing) && (
          <div className="mt-2 text-center">
            <p className="text-xs md:text-sm text-eden-orange font-lato">
              {isRecording ? "🎤 Gravando... Toque novamente para parar" : "✨ Transcrevendo áudio..."}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatIA;
