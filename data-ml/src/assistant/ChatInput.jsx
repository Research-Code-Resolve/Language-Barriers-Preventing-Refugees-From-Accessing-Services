import { useState, useRef } from 'react';
import { theme } from '../theme';
import { SendIcon, MicIcon, FileIcon } from './icons';
import { createRecognition, isRecognitionSupported } from './speech';

export default function ChatInput({ onSend, onDocumentAttach, disabled, language = 'en' }) {
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  }

  function handleMic() {
    if (!isRecognitionSupported()) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    // Toggle off if already listening.
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = createRecognition(language);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    setIsListening(true);
    recognition.start();
  }

  const btnBase = {
    background: 'none',
    border: 'none',
    padding: 8,
    borderRadius: 8,
    cursor: 'pointer',
    color: theme.blue,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        padding: '10px 12px',
        background: theme.white,
        borderTop: `1px solid ${theme.border}`,
      }}
    >
      <button
        type="button"
        onClick={onDocumentAttach}
        style={btnBase}
        title="Attach from Document Scanner"
      >
        <FileIcon />
      </button>
      <button
        type="button"
        onClick={handleMic}
        style={{
          ...btnBase,
          color: isListening ? theme.white : theme.blue,
          background: isListening ? '#ef4444' : 'none',
          animation: isListening ? 'micpulse 1.2s ease-in-out infinite' : 'none',
        }}
        title={isListening ? 'Listening… tap to stop' : 'Speak your question'}
      >
        <MicIcon />
      </button>
      <style>{`@keyframes micpulse{0%,100%{opacity:1}50%{opacity:0.55}}`}</style>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isListening ? 'Listening…' : 'Type your question here...'}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        style={{
          flex: 1,
          resize: 'none',
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: '10px 12px',
          fontSize: 14,
          fontFamily: "'Segoe UI', sans-serif",
          color: theme.textPrimary,
          outline: 'none',
          maxHeight: 100,
          boxSizing: 'border-box',
        }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        style={{
          ...btnBase,
          background: theme.gradient,
          color: theme.white,
          opacity: disabled || !value.trim() ? 0.5 : 1,
          cursor: disabled || !value.trim() ? 'default' : 'pointer',
          padding: '10px 12px',
          borderRadius: 10,
        }}
        title="Send"
      >
        <SendIcon width={18} height={18} />
      </button>
    </form>
  );
}
