import { useState, useEffect, useRef } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);
    }
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current || !text) return;

    // Cancela qualquer fala anterior
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Configurações de voz
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0; // Velocidade normal
    utterance.pitch = 0.9; // Tom ligeiramente mais grave (masculino)
    utterance.volume = 1.0;

    // Tenta encontrar uma voz masculina em português
    const voices = synthRef.current.getVoices();
    const ptBRVoices = voices.filter(voice => voice.lang.includes('pt-BR') || voice.lang.includes('pt_BR'));
    
    // Prioriza vozes masculinas (geralmente contém "male" ou nomes masculinos)
    const maleVoice = ptBRVoices.find(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.includes('Daniel') ||
      voice.name.includes('Ricardo') ||
      voice.name.includes('Paulo') ||
      voice.name.includes('Felipe')
    );

    if (maleVoice) {
      utterance.voice = maleVoice;
    } else if (ptBRVoices.length > 0) {
      // Se não encontrar voz masculina específica, usa a primeira voz pt-BR
      utterance.voice = ptBRVoices[0];
    }

    // Eventos
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Erro no TTS:', event);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeak = (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return {
    speak,
    stop,
    toggleSpeak,
    isSpeaking,
    isSupported,
  };
}
