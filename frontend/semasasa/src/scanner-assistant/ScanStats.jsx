import { useEffect, useState } from 'react';
import { getScanStats } from './storage';

const colors = {
  gradient: 'linear-gradient(90deg, #2E5FA3 0%, #3ED9B5 100%)',
  card: '#FFFFFF',
  border: '#E1E8ED',
  textPrimary: '#1E2A38',
  textSecondary: '#64748B',
};

export default function ScanStats() {
  const [stats, setStats] = useState({ today: 0, thisWeek: 0, total: 0 });

  useEffect(() => {
    setStats(getScanStats());
    const handleFocus = () => setStats(getScanStats());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const cards = [
    { label: 'Today', value: stats.today },
    { label: 'This Week', value: stats.thisWeek },
    { label: 'All Time', value: stats.total },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '20px auto 0', padding: '0 4px' }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: colors.textSecondary,
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        Scan Activity
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              flex: 1,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: '14px 12px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(46, 95, 163, 0.06)',
            }}
          >
            <p
              style={{
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
                background: colors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {c.value}
            </p>
            <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
              {c.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}