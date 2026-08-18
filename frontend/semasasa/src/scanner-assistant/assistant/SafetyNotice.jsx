import { theme } from '../theme';
import { AlertIcon } from './icons';
import { t } from './i18n';

export function SafetyNotice({ language = 'en' }) {
  return (
    <p style={{
      fontSize: 11,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 1.5,
      padding: '0 12px',
    }}>
      {t('safety', language)}
    </p>
  );
}

export function EscalationAlert({ onAction }) {
  const actions = [
    { key: 'interpreter', label: 'Request an interpreter' },
    { key: 'health', label: 'Contact health support' },
    { key: 'legal', label: 'Contact legal/protection support' },
  ];

  return (
    <div style={{
      marginTop: 12,
      background: '#FFF8E8',
      border: `1px solid ${theme.warning}40`,
      borderRadius: 12,
      padding: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <AlertIcon width={18} height={18} style={{ color: theme.warning, flexShrink: 0 }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
          You may need direct support
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {actions.map((a) => (
          <button
            key={a.key}
            onClick={() => onAction(a.key)}
            style={{
              padding: '8px 14px',
              background: theme.white,
              border: `1px solid ${theme.warning}50`,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: theme.textPrimary,
              cursor: 'pointer',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
