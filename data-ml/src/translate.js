export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'sw', label: 'Swahili' },
  { code: 'fr', label: 'French' },
  { code: 'so', label: 'Somali' },
  { code: 'rw', label: 'Kinyarwanda' },
];

const HF_TOKEN = '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';

// NLLB language codes (Meta's model, better for low-resource languages)
const NLLB_CODES = {
  en: 'eng_Latn',
  ar: 'arb_Arab',
  sw: 'swh_Latn',
  fr: 'fra_Latn',
  so: 'som_Latn',
  rw: 'kin_Latn',
};

// Languages where we prefer NLLB over MyMemory
const LOW_RESOURCE = ['so', 'rw'];

async function translateWithMyMemory(text, sourceLang, targetLang) {
  const chunks = text.match(/.{1,450}(\s|$)/g) || [text];
  const translations = [];

  for (const chunk of chunks) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      chunk
    )}&langpair=${sourceLang}|${targetLang}&de=semasasa.project@gmail.com`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Translation request failed (${res.status})`);

    const data = await res.json();
    if (data.responseStatus && data.responseStatus !== 200) {
      throw new Error(data.responseDetails || 'Translation failed for this language pair.');
    }

    translations.push(data.responseData?.translatedText || '');
  }

  return translations.join(' ');
}

async function translateWithNLLB(text, sourceLang, targetLang) {
  const res = await fetch(
    'https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          src_lang: NLLB_CODES[sourceLang],
          tgt_lang: NLLB_CODES[targetLang],
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error('NLLB translation failed. The model may still be loading — try again in a few seconds.');
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data[0]?.translation_text || '';
}

export async function translateText(text, sourceLang, targetLang) {
  if (!text || !text.trim()) return '';
  if (sourceLang === targetLang) return text;

  const needsNLLB = LOW_RESOURCE.includes(sourceLang) || LOW_RESOURCE.includes(targetLang);

  if (needsNLLB) {
    try {
      return await translateWithNLLB(text, sourceLang, targetLang);
    } catch (err) {
      console.warn('NLLB failed, falling back to MyMemory:', err.message);
      return translateWithMyMemory(text, sourceLang, targetLang);
    }
  }

  return translateWithMyMemory(text, sourceLang, targetLang);
}