import { useState } from "react";
import { MessageCircle, Mic, Send, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
      text: "Olá! 👋 Sou sua assistente virtual do Éden. Como posso ajudar você hoje com sua plantação?",
      isUser: false,
      timestamp: "09:00"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Entendi sua pergunta! 🌱 Para te dar a melhor resposta sobre irrigação, preciso saber: qual tipo de cultura você está plantando e qual o tamanho da área?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background pb-safe">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-3 md:p-4 shadow-soft shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
            <MessageCircle size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-roboto font-bold">Adan AI</h1>
            <p className="text-white/90 font-lato text-xs md:text-sm">Assistente especializada em agricultura</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-2 md:p-4 space-y-3 md:space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-[85%] md:max-w-[80%] ${
              message.isUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card shadow-card border-eden-green/20'
            }`}>
              <CardContent className="p-2.5 md:p-3">
                <p className="font-lato text-xs md:text-sm leading-relaxed">{message.text}</p>
                <div className="flex items-center justify-between mt-1.5 md:mt-2">
                  <span className={`text-xs ${
                    message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp}
                  </span>
                  {!message.isUser && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 md:h-6 md:w-6 p-0 hover:bg-secondary/50"
                    >
                      <Volume2 size={10} className="md:w-3 md:h-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Suggestions */}
      <div className="px-2 md:px-4 py-1.5 md:py-2 shrink-0">
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 md:pb-2">
          {["Como irrigar milho?", "Solo muito seco", "Pragas na plantação", "Melhor época plantar"].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs font-lato h-7 md:h-8 px-2 md:px-3"
              onClick={() => setInputValue(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-2 md:p-4 bg-background border-t border-border shrink-0 pb-[calc(env(safe-area-inset-bottom)+80px)]">
        <div className="flex items-center gap-1.5 md:gap-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            className="shrink-0 h-9 w-9 md:h-10 md:w-10"
          >
            <Mic size={16} className={`md:w-[18px] md:h-[18px] ${isRecording ? "animate-pulse" : ""}`} />
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="flex-1 font-lato h-9 md:h-10 text-sm"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim()}
            className="shrink-0 bg-eden-green hover:bg-eden-green/90 h-9 w-9 md:h-10 md:w-10 p-0"
          >
            <Send size={16} className="md:w-[18px] md:h-[18px]" />
          </Button>
        </div>
        
        {isRecording && (
          <div className="mt-2 text-center">
            <p className="text-xs md:text-sm text-eden-orange font-lato">
              🎤 Gravando... Toque novamente para parar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatIA;