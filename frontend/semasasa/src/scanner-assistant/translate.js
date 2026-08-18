// Thin client for translation. All translation now happens on the backend so
// the Hugging Face token stays server-side and never reaches the browser.
// See backend/src/translate.js for the actual MyMemory + NLLB logic.

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'sw', label: 'Swahili' },
  { code: 'fr', label: 'French' },
  { code: 'so', label: 'Somali' },
  { code: 'rw', label: 'Kinyarwanda' },
];

// Endpoint of the backend translation route. Defaults to same-origin
// /api/translate; override with VITE_TRANSLATE_API during local development
// (e.g. http://localhost:8787/api/translate).
const TRANSLATE_API = import.meta.env.VITE_TRANSLATE_API || '/api/translate';

export async function translateText(text, sourceLang, targetLang) {
  if (!text || !text.trim()) return '';
  if (sourceLang === targetLang) return text;

  const res = await fetch(TRANSLATE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sourceLang, targetLang }),
  });

  if (!res.ok) {
    throw new Error(`Translation failed (${res.status}). Is the backend running?`);
  }

  const data = await res.json();
  return data.translatedText || '';
}
