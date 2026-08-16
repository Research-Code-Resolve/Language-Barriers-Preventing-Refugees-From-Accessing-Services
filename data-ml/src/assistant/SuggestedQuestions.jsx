import { theme } from '../theme';

const SUGGESTIONS = [
  'Where can I get legal help?',
  'How can I request an interpreter?',
  'Where can I access healthcare?',
  "I don't understand a document I received.",
];

export default function SuggestedQuestions({ onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: theme.textSecondary, margin: 0 }}>
        Suggested questions
      </p>
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          style={{
            textAlign: 'left',
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
