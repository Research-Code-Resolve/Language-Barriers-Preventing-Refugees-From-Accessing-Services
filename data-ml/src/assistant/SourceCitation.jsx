import { theme } from '../theme';
import { t } from './i18n';

// Shows the "Verified information · Source" badge on human-verified answers.
export default function SourceCitation({ source, verified = false, language = 'en' }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      padding: '4px 10px',
      background: theme.white,
      border: `1px solid ${verified ? theme.mint : theme.border}`,
      borderRadius: 20,
      fontSize: 11,
      color: theme.textSecondary,
    }}>
      <span style={{ fontWeight: 600, color: verified ? theme.blueDark : theme.textSecondary }}>
        {t('verified', language)}
      </span>
      {verified && source && (
        <>
          <span style={{ color: theme.border }}>·</span>
          <span>{t('source', language)}: {source}</span>
        </>
      )}
    </div>
  );
}
