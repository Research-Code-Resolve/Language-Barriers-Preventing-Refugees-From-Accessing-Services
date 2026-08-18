// Browser voice helpers: speech-to-text (input) and text-to-speech (output).
// Uses the Web Speech API — works in Chrome/Edge; unavailable in some browsers.
// Somali (so) and Kinyarwanda (rw) are poorly supported by browser engines.

// App language code -> BCP-47 locale for speech recognition / synthesis.
const SPEECH_LOCALES = {
  en: 'en-US',
  ar: 'ar-SA',
  sw: 'sw-KE',
  fr: 'fr-FR',
  so: 'so-SO',
  rw: 'rw-RW',
};

export function speechLocale(lang) {
  return SPEECH_LOCALES[lang] || 'en-US';
}

export function isRecognitionSupported() {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Create a one-shot SpeechRecognition instance for the given app language.
export function createRecognition(lang) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const recognition = new SR();
  recognition.lang = speechLocale(lang);
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

// Read text aloud in the given app language. Cancels any current speech.
export function speak(text, lang) {
  if (!isSynthesisSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLocale(lang);
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSynthesisSupported()) window.speechSynthesis.cancel();
}
