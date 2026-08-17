import { useState } from 'react';
import { theme, LANGUAGES, LOCATIONS } from '../theme';
import { GlobeIcon, PinIcon } from './icons';
import { t } from './i18n';

const compactSelect = {
  padding: '7px 10px',
  borderRadius: 8,
  border: `1px solid ${theme.border}`,
  fontSize: 13,
  color: theme.textPrimary,
  background: theme.white,
  cursor: 'pointer',
  fontFamily: "'Segoe UI', sans-serif",
};

const chip = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  color: theme.textPrimary,
};

// Compact, collapsible context bar: location + language only.
// Service type was removed — it only nudged retrieval ranking and added a third
// menu before the user could start. Retrieval works from keywords + location.
export function ContextBar({ location, setLocation, language, setLanguage }) {
  const [open, setOpen] = useState(false);

  const locLabel = LOCATIONS.find((l) => l.code === location)?.label || location;
  const langLabel = LANGUAGES.find((l) => l.code === language)?.label || language;

  const barStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    background: theme.white,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: '8px 12px',
    boxShadow: theme.shadowSoft,
    marginBottom: 12,
  };

  if (!open) {
    return (
      <div style={barStyle}>
        <span style={chip}>
          <PinIcon width={14} height={14} style={{ color: theme.blue }} />
          {locLabel}
        </span>
        <span style={{ color: theme.border }}>·</span>
        <span style={chip}>
          <GlobeIcon width={14} height={14} style={{ color: theme.blue }} />
          {langLabel}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ marginInlineStart: 'auto', background: 'none', border: 'none', color: theme.blue, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          {t('change', language)}
        </button>
      </div>
    );
  }

  return (
    <div style={barStyle}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <PinIcon width={14} height={14} style={{ color: theme.blue }} />
        <select aria-label={t('yourLocation', language)} value={location} onChange={(e) => setLocation(e.target.value)} style={compactSelect}>
          {LOCATIONS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </label>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <GlobeIcon width={14} height={14} style={{ color: theme.blue }} />
        <select aria-label={t('preferredLanguage', language)} value={language} onChange={(e) => setLanguage(e.target.value)} style={compactSelect}>
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </label>
      <button
        type="button"
        onClick={() => setOpen(false)}
        style={{ marginInlineStart: 'auto', background: theme.gradient, color: theme.white, border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
      >
        {t('done', language)}
      </button>
    </div>
  );
}
