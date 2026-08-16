import { useState, useEffect, useRef, useCallback } from 'react';
import { theme } from '../theme';
import { ContextBar } from './Selectors';
import SuggestedQuestions from './SuggestedQuestions';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { SafetyNotice, EscalationAlert } from './SafetyNotice';
import { ArrowRightIcon, FileIcon } from './icons';
import { sendChatMessage } from './chatService';
import {
  getDocumentIntro,
  getDocumentActionResponse,
  DOCUMENT_ACTIONS,
} from './mockResponses';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function RefugeeSupportAssistant({ pendingDocumentText, onDocumentTextConsumed, onNavigateScanner }) {
  const [location, setLocation] = useState('kakuma');
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const scrollRef = useRef(null);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { ...msg, timestamp: formatTime(Date.now()) }]);
  }, []);

  const sendAssistantMessage = useCallback(async (text) => {
    setIsTyping(true);
    try {
      const response = await sendChatMessage({
        message: text,
        language,
        location,
        serviceType: null,
        documentContext: documentText || null,
      });
      addMessage({
        role: 'assistant',
        text: response.text,
        source: response.source,
        isDemo: response.isDemo,
        verified: response.verified,
      });
    } catch {
      addMessage({
        role: 'assistant',
        text: 'Sorry, I could not process your request right now. Please try again.',
        isDemo: true,
        verified: false,
      });
    }
    setIsTyping(false);
  }, [language, location, documentText, addMessage]);

  const handleSend = useCallback((text) => {
    addMessage({ role: 'user', text });
    sendAssistantMessage(text);
  }, [addMessage, sendAssistantMessage]);

  const handleSuggestion = useCallback((q) => {
    addMessage({ role: 'user', text: q });
    sendAssistantMessage(q);
  }, [addMessage, sendAssistantMessage]);

  // Receive document text from Document Scanner
  useEffect(() => {
    if (pendingDocumentText && pendingDocumentText.trim()) {
      setDocumentText(pendingDocumentText.trim());
      onDocumentTextConsumed?.();
      setMessages([]);
      const intro = getDocumentIntro(language);
      addMessage({ role: 'assistant', text: intro, isDemo: true, verified: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingDocumentText]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleDocumentAction(action) {
    if (action === 'ask_another') {
      setDocumentText('');
      setMessages([]);
      return;
    }
    addMessage({ role: 'user', text: DOCUMENT_ACTIONS.find((a) => a.key === action).label });
    setIsTyping(true);
    setTimeout(() => {
      const text = getDocumentActionResponse(action, language);
      addMessage({ role: 'assistant', text, source: null, isDemo: true, verified: false });
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  }

  function handleEscalate(action) {
    const labels = {
      interpreter: 'Request an interpreter',
      health: 'Contact health support',
      legal: 'Contact legal/protection support',
    };
    addMessage({ role: 'user', text: labels[action] });
    setIsTyping(true);
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        text: 'Thank you for reaching out. A staff member from the relevant service desk will follow up with you. In the meantime, please visit the service point in your camp for immediate assistance. This is a demo response — real routing will be connected in a future update.',
        source: null,
        isDemo: true,
        verified: false,
      });
      setIsTyping(false);
      setShowEscalation(false);
    }, 600);
  }

  function removeDocument() {
    setDocumentText('');
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 16px', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: theme.white,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h2 style={{
            background: theme.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: 22,
            margin: 0,
          }}>
            Refugee Support Assistant
          </h2>
        </div>
        <p style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 600, margin: 0 }}>
          Get trusted help in your language for health and legal services.
        </p>
        <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
          Ask questions, understand service information, and get guidance in your preferred language.
        </p>
      </div>

      {/* Compact, collapsible context bar (location + language) */}
      <ContextBar
        location={location}
        setLocation={setLocation}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Chat area */}
      <div style={{
        background: theme.white,
        borderRadius: 16,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        display: 'flex',
        flexDirection: 'column',
        height: 'min(70vh, 560px)',
        overflow: 'hidden',
      }}>
        {/* Messages */}
        <div ref={scrollRef} style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: theme.bg,
        }}>
          {messages.length === 0 && !documentText && (
            <>
              {/* Initial assistant greeting */}
              <MessageBubble message={{
                role: 'assistant',
                text: "Hello \u{1F44B} I'm here to help you understand health and legal services in your language. How can I help you today?",
                isDemo: false,
                verified: false,
                timestamp: formatTime(Date.now()),
              }} language={language} />
              <SuggestedQuestions onSelect={handleSuggestion} />
            </>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} language={language} />
          ))}

          {/* Document action buttons */}
          {documentText && !isTyping && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {DOCUMENT_ACTIONS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => handleDocumentAction(a.key)}
                  style={{
                    padding: '8px 14px',
                    background: theme.aquaSoft,
                    border: `1px solid ${theme.mint}`,
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: theme.textPrimary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {a.label}
                  <ArrowRightIcon width={14} height={14} style={{ color: theme.blue }} />
                </button>
              ))}
            </div>
          )}

          {isTyping && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: theme.gradient, color: theme.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>AI</div>
              <div style={{
                background: theme.aquaSoft,
                border: `1px solid ${theme.aqua}`,
                borderRadius: 16,
                padding: '10px 16px',
                display: 'flex',
                gap: 4,
              }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: theme.mint,
                    animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <style>{`@keyframes pulse{0%,80%,100%{opacity:0.3}40%{opacity:1}}`}</style>
            </div>
          )}

          {showEscalation && <EscalationAlert onAction={handleEscalate} />}
        </div>

        {/* Document attached indicator */}
        {documentText && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: theme.aquaSoft,
            borderTop: `1px solid ${theme.aqua}`,
            fontSize: 12,
            color: theme.textPrimary,
          }}>
            <FileIcon width={14} height={14} style={{ color: theme.blue, flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>Document attached</span>
            <span style={{ color: theme.textSecondary, fontSize: 11, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {documentText.slice(0, 80)}{documentText.length > 80 ? '...' : ''}
            </span>
            <button
              onClick={removeDocument}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: theme.textSecondary,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: 6,
              }}
            >
              Remove
            </button>
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          onDocumentAttach={onNavigateScanner}
          disabled={isTyping}
          language={language}
        />
      </div>

      {/* Safety notice */}
      <div style={{ marginTop: 12 }}>
        <SafetyNotice />
      </div>
    </div>
  );
}
