import { theme } from '../theme';
import { t } from './i18n';
import { CheckIcon } from './icons';

// Discreet inline "verified" line shown under human-verified answers — a small
// check + muted text, no bordered pill, so it does not compete with the answer.
export default function SourceCitation({ source, verified = false, language = 'en' }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      marginTop: 6,
      fontSize: 10.5,
      lineHeight: 1.3,
      color: theme.textSecondary,
    }}>
      <CheckIcon width={12} height={12} style={{ color: theme.mint, flexShrink: 0 }} />
      <span>
        {t('verified', language)}
        {verified && source ? ` · ${source}` : ''}
      </span>
    </div>
  );
}
