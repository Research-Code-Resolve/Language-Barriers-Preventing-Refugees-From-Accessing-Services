import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DocumentScanner from './DocumentScanner';
import ScanStats from './ScanStats';
import RefugeeSupportAssistant from './assistant/RefugeeSupportAssistant';
import { theme } from './theme';
import { FileIcon } from './assistant/icons';
import { t } from './assistant/i18n';

export default function DocumentToolsPage() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [pendingDocumentText, setPendingDocumentText] = useState('');
  const [language, setLanguage] = useState('en');

  const handleAskAIAboutDocument = useCallback((text) => {
    setPendingDocumentText(text);
    setActiveTab('assistant');
  }, []);

  const handleDocumentTextConsumed = useCallback(() => {
    setPendingDocumentText('');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        :focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(65, 153, 203, 0.5);
          border-radius: 8px;
        }
      `}</style>
      <nav style={{
        background: theme.white,
        borderBottom: `1px solid ${theme.border}`,
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: theme.shadowSoft,
      }}>
        <div style={{
          maxWidth: 640,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Link
            to="/"
            title={t('home', language)}
            aria-label={t('home', language)}
            style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}
          >
            <img src="/semasasa-logo.png" alt="SemaSasa" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <TabButton
              active={activeTab === 'scanner'}
              onClick={() => setActiveTab('scanner')}
              icon={<FileIcon width={18} height={18} />}
              label={t('documentScanner', language)}
            />
            <TabButton
              active={activeTab === 'assistant'}
              onClick={() => setActiveTab('assistant')}
              label={t('aiAssistant', language)}
            />
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: 16, paddingBottom: 40 }}>
        {activeTab === 'scanner' && (
          <>
            <DocumentScanner onAskAI={handleAskAIAboutDocument} />
            <ScanStats />
          </>
        )}
        {activeTab === 'assistant' && (
          <RefugeeSupportAssistant
            pendingDocumentText={pendingDocumentText}
            onDocumentTextConsumed={handleDocumentTextConsumed}
            onNavigateScanner={() => setActiveTab('scanner')}
            language={language}
            setLanguage={setLanguage}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: icon ? 8 : 0,
        padding: '10px 18px',
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 600,
        background: active ? theme.gradient : 'transparent',
        color: active ? theme.white : theme.textSecondary,
        transition: 'background 0.2s, color 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
