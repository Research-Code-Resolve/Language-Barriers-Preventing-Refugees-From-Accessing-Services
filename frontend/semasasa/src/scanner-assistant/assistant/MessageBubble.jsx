import { theme } from '../theme';
import SourceCitation from './SourceCitation';
import { SpeakerIcon } from './icons';
import { speak, isSynthesisSupported } from './speech';
import { t } from './i18n';

const RTL_LANGUAGES = ['ar'];

export default function MessageBubble({ message, language = 'en' }) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isRtl = RTL_LANGUAGES.includes(language);

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
        {isAssistant && isSynthesisSupported() && (
          <button
            type="button"
            onClick={() => speak(message.text, language)}
            title="Read aloud"
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
        {/* Only show the trust badge for human-verified answers. Unverified
            answers show no label (rather than a "Demo response" tag). */}
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
