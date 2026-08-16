import { theme } from '../theme';

// Reusable source citation component.
// When `verified` is true (future RAG backend), shows "Verified information" with the source.
// When `verified` is false (current demo), shows "Demo response" instead.
export default function SourceCitation({ source, verified = false }) {
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
      <span style={{
        fontWeight: 600,
        color: verified ? theme.blueDark : theme.textSecondary,
      }}>
        {verified ? 'Verified information' : 'Demo response'}
      </span>
      {verified && source && (
        <>
          <span style={{ color: theme.border }}>·</span>
          <span>Source: {source}</span>
        </>
      )}
    </div>
  );
}
