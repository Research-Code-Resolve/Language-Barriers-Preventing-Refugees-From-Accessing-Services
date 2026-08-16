import { useState } from 'react';
import { theme } from '../theme';
import { SendIcon, MicIcon, FileIcon } from './icons';

export default function ChatInput({ onSend, onDocumentAttach, disabled }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
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
      <button type="button" style={btnBase} title="Voice input (coming soon)">
        <MicIcon />
      </button>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your question here..."
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
