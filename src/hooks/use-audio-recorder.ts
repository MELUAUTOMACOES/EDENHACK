import { useState, useRef } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Verifica se a API está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Seu navegador não suporta gravação de áudio. Use Chrome, Firefox ou Edge atualizado.');
      }

      // Verifica se está em contexto seguro (HTTPS ou localhost)
      if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
        throw new Error('Gravação de áudio requer HTTPS. Acesse via https:// ou localhost.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Verifica suporte ao MediaRecorder
      if (!window.MediaRecorder) {
        stream.getTracks().forEach(track => track.stop());
        throw new Error('Seu navegador não suporta MediaRecorder.');
      }

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 
                       MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg' : 
                       'audio/wav';
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType;
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        
        // Limpa o stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error: any) {
      console.error('Erro ao iniciar gravação:', error);
      
      // Mensagem específica baseada no erro
      let message = 'Erro ao acessar o microfone.';
      
      if (error.message) {
        message = error.message;
      } else if (error.name === 'NotAllowedError') {
        message = 'Permissão negada. Permita o acesso ao microfone nas configurações do navegador.';
      } else if (error.name === 'NotFoundError') {
        message = 'Nenhum microfone encontrado. Conecte um microfone e tente novamente.';
      } else if (error.name === 'NotReadableError') {
        message = 'Microfone em uso por outro aplicativo.';
      }
      
      alert(message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    chunksRef.current = [];
  };

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    toggleRecording,
    clearAudio,
  };
}
