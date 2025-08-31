// Gera/recupera um sessionId persistente no navegador
function getChatSessionId(): string {
  const key = 'eden_chat_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `sess-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  formData.append('sessionId', getChatSessionId());

  const response = await fetch('/api/gemini/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro ao transcrever áudio' }));
    throw new Error(error.error || `Erro: ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
}
