import { theme, LANGUAGES, LOCATIONS, SERVICE_TYPES } from '../theme';
import { HeartIcon, ShieldIcon, GlobeIcon, PinIcon } from './icons';

const selectStyle = {
  padding: '9px 12px',
  borderRadius: 10,
  border: `1px solid ${theme.border}`,
  fontSize: 13,
  color: theme.textPrimary,
  background: theme.white,
  outline: 'none',
  cursor: 'pointer',
  fontFamily: "'Segoe UI', sans-serif",
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: theme.textSecondary,
  marginBottom: 6,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

export function LocationSelector({ value, onChange }) {
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <label style={labelStyle}>
        <PinIcon width={14} height={14} style={{ color: theme.blue }} />
        Your location
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {LOCATIONS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
}

export function LanguageSelector({ value, onChange }) {
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <label style={labelStyle}>
        <GlobeIcon width={14} height={14} style={{ color: theme.blue }} />
        Preferred language
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ServiceSelector({ value, onChange }) {
  return (
    <div>
      <label style={{ ...labelStyle, marginBottom: 8 }}>Service type</label>
      <div style={{ display: 'flex', gap: 10 }}>
        {SERVICE_TYPES.map((s) => {
          const selected = value === s.code;
          const Icon = s.code === 'health' ? HeartIcon : ShieldIcon;
          return (
            <button
              key={s.code}
              onClick={() => onChange(s.code)}
              style={{
                flex: 1,
                padding: '14px 12px',
                background: selected ? theme.aquaSoft : theme.white,
                border: `2px solid ${selected ? theme.mint : theme.border}`,
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s, background 0.15s',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: selected ? theme.gradient : theme.aquaSoft,
                color: selected ? theme.white : theme.blue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
              }}>
                <Icon width={20} height={20} />
              </div>
              <p style={{
                fontSize: 13,
                fontWeight: 700,
                margin: 0,
                color: theme.textPrimary,
              }}>
                {s.label}
              </p>
              <p style={{
                fontSize: 11,
                margin: 0,
                color: theme.textSecondary,
                lineHeight: 1.3,
              }}>
                {s.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
