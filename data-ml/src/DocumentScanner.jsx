import { useState } from 'react';
import { extractText, OCR_LANGUAGES } from './fileReaders';
import { logScanEvent } from './storage';
import { translateText, LANGUAGES } from './translate';
import { theme } from './theme';
import { SparkleIcon } from './assistant/icons';

const colors = {
  blue: '#2E5FA3',
  teal: '#3ED9B5',
  gradient: 'linear-gradient(90deg, #2E5FA3 0%, #3ED9B5 100%)',
  bg: '#F9FBFC',
  card: '#FFFFFF',
  textPrimary: '#1E2A38',
  textSecondary: '#64748B',
  border: '#E1E8ED',
};

export default function DocumentScanner({ onAskAI }) {
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [ocrLang, setOcrLang] = useState('eng');
  const [extractedText, setExtractedText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setExtractedText('');
    setTranslatedText('');
    setScanError('');
    setPendingFile(file);

    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  async function runExtraction() {
    if (!pendingFile) return;
    setIsScanning(true);
    setProgress(0);
    setScanError('');
    try {
      const text = await extractText(pendingFile, ocrLang, setProgress);
      setExtractedText(text || '');
      logScanEvent();
    } catch (err) {
      setScanError(err.message || 'Could not read this file. Try a clearer photo or a different file.');
    }
    setIsScanning(false);
  }

  async function handleTranslate() {
    if (!extractedText.trim()) return;
    setIsTranslating(true);
    setTranslateError('');
    try {
      const result = await translateText(extractedText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setTranslateError(err.message || 'Translation failed. Please try again.');
    }
    setIsTranslating(false);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  const isApproximateLang = ocrLang === 'eng' && (
    OCR_LANGUAGES.find(l => l.code === ocrLang && l.label.includes('approximate'))
  );

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 28, fontFamily: "'Segoe UI', sans-serif", background: colors.bg, borderRadius: 16 }}>
      <div style={{ background: colors.card, borderRadius: 16, padding: 24, border: `1px solid ${colors.border}`, boxShadow: '0 4px 20px rgba(46, 95, 163, 0.08)' }}>
        <h2 style={{ background: colors.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700, fontSize: 22, margin: 0 }}>
          Document Scanner
        </h2>
        <p style={{ color: colors.textSecondary, fontSize: 14, marginTop: 6 }}>
          Upload a photo, scanned image, PDF, or Word document to extract and translate the text.
        </p>

        <label style={{ display: 'inline-block', marginTop: 18, padding: '10px 18px', background: colors.gradient, color: '#fff', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, boxShadow: '0 2px 8px rgba(46, 95, 163, 0.25)' }}>
          Choose File
          <input
            type="file"
            accept="image/*,.pdf,.docx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>

        {fileName && (
          <p style={{ marginTop: 10, fontSize: 13, color: colors.textSecondary }}>{fileName}</p>
        )}

        {previewUrl && (
          <img src={previewUrl} alt="Uploaded document" style={{ width: '100%', marginTop: 12, borderRadius: 12, border: `1px solid ${colors.border}` }} />
        )}

        {pendingFile && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: colors.textPrimary, marginBottom: 6 }}>
              Document language
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={ocrLang}
                onChange={(e) => setOcrLang(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13 }}
              >
                {OCR_LANGUAGES.map((l, i) => (
                  <option key={i} value={l.code}>{l.label}</option>
                ))}
              </select>
              <button
                onClick={runExtraction}
                disabled={isScanning}
                style={{ padding: '9px 18px', background: colors.gradient, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Extract Text
              </button>
            </div>
            <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>
              Select the language the document is written in — this improves extraction accuracy.
              Somali and Kinyarwanda use an approximate model; please review and correct the extracted text below if needed.
            </p>
          </div>
        )}

        {isScanning && (
          <div style={{ marginTop: 18 }}>
            <p style={{ color: colors.blue, fontSize: 14, fontWeight: 500 }}>Processing... {progress}%</p>
            <div style={{ height: 6, background: colors.border, borderRadius: 4, overflow: 'hidden', marginTop: 6 }}>
              <div style={{ width: `${progress}%`, height: '100%', background: colors.gradient, transition: 'width 0.2s ease' }} />
            </div>
          </div>
        )}

        {scanError && (
          <p style={{ marginTop: 16, color: '#B94A48', fontSize: 14 }}>{scanError}</p>
        )}

        {(extractedText || (pendingFile && !isScanning && fileName)) && !isScanning && extractedText !== '' && (
          <div style={{ marginTop: 20, background: '#F0FBF8', border: `1px solid ${colors.teal}33`, padding: 16, borderRadius: 12 }}>
            <p style={{ fontWeight: 600, marginBottom: 8, color: colors.textPrimary, fontSize: 14 }}>
              Extracted Text {isApproximateLang && <span style={{ fontWeight: 400, color: colors.textSecondary }}>(review and edit if needed)</span>}
            </p>
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={6}
              style={{
                width: '100%',
                fontSize: 14,
                color: colors.textPrimary,
                fontFamily: "'Segoe UI', sans-serif",
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: 10,
                resize: 'vertical',
                direction: ocrLang === 'ara' ? 'rtl' : 'ltr',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <button onClick={() => copyToClipboard(extractedText)} style={{ padding: '9px 16px', background: colors.gradient, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                Copy Text
              </button>
              {onAskAI && (
                <button
                  onClick={() => onAskAI(translatedText || extractedText)}
                  style={{
                    padding: '9px 16px',
                    background: theme.white,
                    border: `2px solid ${theme.mint}`,
                    color: theme.blueDark,
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <SparkleIcon width={16} height={16} style={{ color: theme.blue }} />
                  Ask AI about this document
                </button>
              )}
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${colors.border}` }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: colors.textPrimary, marginBottom: 8 }}>Translate</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13 }}>
                  {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
                <span style={{ color: colors.textSecondary, fontSize: 13 }}>→</span>
                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13 }}>
                  {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
                <button onClick={handleTranslate} style={{ padding: '8px 16px', background: colors.gradient, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  Translate
                </button>
              </div>

              {isTranslating && <p style={{ marginTop: 10, color: colors.blue, fontSize: 13 }}>Translating...</p>}
              {translateError && <p style={{ marginTop: 10, color: '#B94A48', fontSize: 13 }}>{translateError}</p>}

              {translatedText && !isTranslating && (
                <div style={{ marginTop: 12, background: '#EAF2FF', padding: 14, borderRadius: 10 }}>
                  <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: colors.textPrimary }}>Translated Text</p>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: 14, color: colors.textPrimary, direction: targetLang === 'ar' ? 'rtl' : 'ltr' }}>
                    {translatedText}
                  </p>
                  <button onClick={() => copyToClipboard(translatedText)} style={{ marginTop: 10, padding: '7px 14px', background: colors.blue, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    Copy Translation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
