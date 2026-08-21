import { useState } from 'react';
import { theme } from '../theme';
import SourceCitation from './SourceCitation';
import { SpeakerIcon, PencilIcon } from './icons';
import { speak, isSynthesisSupported } from './speech';
import { t } from './i18n';

const RTL_LANGUAGES = ['ar'];

export default function MessageBubble({ message, language = 'en', onSubmitEdit }) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isRtl = RTL_LANGUAGES.includes(language);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.text);

  const startEdit = () => {
    setDraft(message.text);
    setEditing(true);
  };
  const cancelEdit = () => {
    setEditing(false);
    setDraft(message.text);
  };
  const saveEdit = () => {
    const text = draft.trim();
    if (!text) return;
    setEditing(false);
    onSubmitEdit(text);
  };

  // Inline editing (ChatGPT / Claude style): the user message turns into an
  // editable box in place, with Cancel / Send.
  if (isUser && editing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '100%', maxWidth: '85%' }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            rows={2}
            dir={isRtl ? 'rtl' : 'ltr'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveEdit();
              } else if (e.key === 'Escape') {
                cancelEdit();
              }
            }}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: `1px solid ${theme.blue}`,
              borderRadius: 12,
              padding: '10px 12px',
              fontSize: 14,
              lineHeight: 1.4,
              fontFamily: "'Segoe UI', sans-serif",
              color: theme.textPrimary,
              resize: 'vertical',
              textAlign: isRtl ? 'right' : 'left',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: '6px 14px',
                background: theme.white,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: theme.textSecondary,
                cursor: 'pointer',
              }}
            >
              {t('cancel', language)}
            </button>
            <button
              type="button"
              onClick={saveEdit}
              disabled={!draft.trim()}
              style={{
                padding: '6px 16px',
                background: theme.gradient,
                border: 'none',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: theme.white,
                cursor: draft.trim() ? 'pointer' : 'default',
                opacity: draft.trim() ? 1 : 0.5,
              }}
            >
              {t('send', language)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bubbleStyle = isUser
    ? {
        background: theme.blue,
        color: theme.white,
        marginLeft: 'auto',
        borderRadius: '16px 16px 4px 16px',
      }
    : {
        background: theme.aquaSoft,
        color: theme.textPrimary,
        borderRadius: '16px 16px 16px 4px',
        border: `1px solid ${theme.aqua}`,
      };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: theme.gradient,
          color: theme.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          marginTop: 2,
        }}>
          AI
        </div>
      )}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          ...bubbleStyle,
          padding: '10px 14px',
          fontSize: 14,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
        }}>
          {message.text}
        </div>
        {isUser && onSubmitEdit && (
          <div style={{ textAlign: 'right', marginTop: 3 }}>
            <button
              type="button"
              onClick={startEdit}
              title={t('edit', language)}
              aria-label={t('edit', language)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              <PencilIcon width={12} height={12} />
              {t('edit', language)}
            </button>
          </div>
        )}
        {isAssistant && isSynthesisSupported() && (
          <button
            type="button"
            onClick={() => speak(message.text, language)}
            title={t('listen', language)}
            aria-label="Read message aloud"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              marginTop: 6,
              padding: '3px 10px',
              background: theme.white,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              color: theme.blue,
              cursor: 'pointer',
            }}
          >
            <SpeakerIcon width={13} height={13} />
            {t('listen', language)}
          </button>
        )}
        {isAssistant && message.verified === true && message.source && (
          <SourceCitation source={message.source} verified={true} language={language} />
        )}
        {message.timestamp && (
          <p style={{
            fontSize: 10,
            color: theme.textSecondary,
            marginTop: 4,
            textAlign: isUser ? 'right' : 'left',
          }}>
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
