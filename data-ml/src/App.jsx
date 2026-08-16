import { useState, useCallback } from 'react';
import DocumentScanner from './DocumentScanner';
import ScanStats from './ScanStats';
import RefugeeSupportAssistant from './assistant/RefugeeSupportAssistant';
import { theme } from './theme';
import { FileIcon } from './assistant/icons';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [pendingDocumentText, setPendingDocumentText] = useState('');

  const handleAskAIAboutDocument = useCallback((text) => {
    setPendingDocumentText(text);
    setActiveTab('assistant');
  }, []);

  const handleDocumentTextConsumed = useCallback(() => {
    setPendingDocumentText('');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Top navigation */}
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
          maxWidth: 520,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <TabButton
            active={activeTab === 'scanner'}
            onClick={() => setActiveTab('scanner')}
            icon={<FileIcon width={18} height={18} />}
            label="Document Scanner"
          />
          <TabButton
            active={activeTab === 'assistant'}
            onClick={() => setActiveTab('assistant')}
            label="AI Assistant"
          />
        </div>
      </nav>

      {/* Content */}
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
