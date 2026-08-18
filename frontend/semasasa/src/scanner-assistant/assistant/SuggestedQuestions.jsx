import { theme } from '../theme';
import { t } from './i18n';

const KEYS = ['q_legal', 'q_interpreter', 'q_health', 'q_document'];

export default function SuggestedQuestions({ onSelect, language = 'en' }) {
  const suggestions = KEYS.map((k) => t(k, language));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: theme.textSecondary, margin: 0 }}>
        {t('suggestedTitle', language)}
      </p>
      {suggestions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          style={{
            textAlign: 'start',
            padding: '10px 14px',
            background: theme.white,
            border: `1px solid ${theme.aqua}`,
            borderRadius: 10,
            fontSize: 13,
            color: theme.textPrimary,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = theme.aquaSoft; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = theme.white; }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
