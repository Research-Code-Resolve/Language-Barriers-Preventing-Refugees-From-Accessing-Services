import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { loadKnowledgeBase } from './src/knowledgeBase.js';
import { retrieve } from './src/retrieve.js';
import { buildSystemPrompt, buildUserPrompt } from './src/prompt.js';
import { generateAnswer, llmStatus } from './src/llm.js';
import { translateText } from './src/translate.js';

const app = express();
app.use(cors());
app.use(express.json());

// Load the knowledge base once at startup.
let KB = [];
try {
  KB = loadKnowledgeBase();
} catch (err) {
  console.error(`[kb] failed to load knowledge base: ${err.message}`);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, entries: KB.length, llm: llmStatus() });
});

// POST /api/chat
// Body: { message, language, location, serviceType, documentContext }
// Returns: { answer, sources: string[], verified: boolean }
app.post('/api/chat', async (req, res) => {
  const { message, language = 'en', location = '', serviceType = 'health', documentContext = null } = req.body || {};

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const entries = retrieve(KB, { message, location, serviceType });

    const system = buildSystemPrompt(language);
    const user = buildUserPrompt({ message, entries, documentContext });

    const { text, mode } = await generateAnswer({ system, user, entries });

    // An answer is only "verified" when every grounding entry has been
    // human-verified (last_verified set). The seed data is unverified, so
    // the UI will correctly label these as demo responses until reviewed.
    const verified = entries.length > 0 && entries.every((e) => e.verified);

    const sources = [...new Set(entries.map((e) => e.source_title).filter(Boolean))];

    res.json({ answer: text, sources, verified, mode });
  } catch (err) {
    console.error(`[chat] error: ${err.message}`);
    res.status(500).json({ error: 'internal error' });
  }
});

// POST /api/translate
// Body: { text, sourceLang, targetLang }
// Returns: { translatedText }
// Keeps the Hugging Face token server-side (used for NLLB on low-resource langs).
app.post('/api/translate', async (req, res) => {
  const { text, sourceLang, targetLang } = req.body || {};

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (!sourceLang || !targetLang) {
    return res.status(400).json({ error: 'sourceLang and targetLang are required' });
  }

  try {
    const translatedText = await translateText(text, sourceLang, targetLang);
    res.json({ translatedText });
  } catch (err) {
    console.error(`[translate] error: ${err.message}`);
    res.status(502).json({ error: 'translation failed' });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  const { provider, model } = llmStatus();
  console.log(`[server] SemaSasa backend listening on http://localhost:${PORT}`);
  console.log(`[server] LLM provider: ${provider} (model: ${model}), KB entries: ${KB.length}`);
});
