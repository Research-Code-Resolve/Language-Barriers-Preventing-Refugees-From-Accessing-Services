# SemaSasa — Document Scanner & Refugee Support Assistant

Two connected tools that help health and legal service providers work with
refugees across language barriers:

1. **Document Scanner** — scan a physical document (ID card, prescription,
   referral form, legal notice), extract its text with in-browser OCR, and
   translate it, removing the need for manual retyping.
2. **Refugee Support Assistant** — a multilingual RAG chatbot that answers
   questions about health, legal, protection and documentation services, in the
   user's own language, grounded in a verified knowledge base.

Both share a brand palette (`theme.js`) and can hand off document text from the
scanner into the assistant.

## Features

### Document Scanner
- **Multi-format upload** — photos, scanned images, PDFs, and Word (.docx) files.
- **Automatic text extraction** — OCR for images and scanned PDFs runs in the
  browser (Tesseract.js); text-based PDFs and DOCX are parsed directly.
- **Editable extracted text** — review and correct before translating, useful
  for lower-resource languages.
- **Translation** — into English, Arabic, Swahili, French, Somali, or
  Kinyarwanda, via the backend translation proxy (see below).
- **Right-to-left support** — Arabic displays correctly.
- **Copy to clipboard** and a lightweight **scan-analytics** panel (counts only,
  no document content stored).

### Refugee Support Assistant
- **Grounded RAG answers** — the assistant answers only from the knowledge base
  (`knowledge_base/`: curated Q&A + ingested documents), and says it doesn't know
  rather than guessing. See `backend/README.md`.
- **Multilingual** — ask in any supported language: the query is translated for
  retrieval and the answer comes back in the user's language.
- **Open-source LLM** — generation runs server-side (default: an open-source
  model via Hugging Face); provider is configurable in the backend.
- **Localised interface** — all UI text is translated (`i18n.js`) into the six
  languages, with the whole assistant flipping to RTL for Arabic.
- **Voice** — ask by speaking (speech-to-text) and have answers read aloud
  (`speech.js`, Web Speech API; Chrome/Edge).
- **Verified sources** — human-verified answers show a discreet "Verified ·
  Source" line; unverified answers show no badge.
- **Document handoff** — send extracted text from the scanner via "Ask AI about
  this document."
- **Suggested questions**, a **safety notice**, and an **escalation** prompt for
  when a user needs direct human support.

## Tech stack

- **Tesseract.js** — client-side OCR for images and scanned PDFs.
- **pdfjs-dist** — extracts embedded text from PDFs (OCR fallback for scans).
- **mammoth** — extracts text from Word (.docx) files.
- **Backend** (`../backend`) — hosts translation (`POST /api/translate`) and the
  RAG chat (`POST /api/chat`), so the Hugging Face token stays server-side and
  never reaches the browser. `translate.js` and `chatService.js` are thin clients.
- **Web Speech API** — voice input and read-aloud.
- **localStorage** — scan-event logging (timestamp only).
- No dependency on the main app's authentication or database layer.

## File structure

```
src/
  App.jsx                          — tab navigation; owns the shared language state
  DocumentScanner.jsx              — OCR upload, extraction, editing, translation UI
  ScanStats.jsx                    — scan-activity analytics panel
  storage.js                       — localStorage helper for scan-event logging
  translate.js                     — thin client to the backend /api/translate
  fileReaders.js                   — OCR, PDF, and DOCX extraction logic
  theme.js                         — design tokens + supported languages/locations
  main.jsx                         — app entry point
  assistant/
    RefugeeSupportAssistant.jsx    — main assistant chat interface
    ChatInput.jsx                  — input, with document attach and voice input
    chatService.js                 — chat client (RAG backend; mock fallback)
    mockResponses.js               — offline mock responses (fallback)
    MessageBubble.jsx              — chat message rendering
    SourceCitation.jsx             — discreet "Verified · Source" badge
    SafetyNotice.jsx               — safety disclaimer and escalation prompt
    Selectors.jsx                  — ContextBar: compact location + language bar
    SuggestedQuestions.jsx         — starter question prompts
    speech.js                      — Web Speech API helpers (voice + read-aloud)
    i18n.js                        — interface translations for all 6 languages
    icons.jsx                      — shared inline SVG icon set
```

## Getting started

This frontend and the `backend/` RAG API run together.

```bash
# 1. Backend (translation + chat)
cd backend
cp .env.example .env        # set HF_TOKEN + LLM_PROVIDER for real generation
npm install
npm start                   # http://localhost:8787

# 2. This frontend (in another terminal)
cd data-ml
npm install
npm run dev                 # http://localhost:5174
```

To point the frontend at the backend, set in `data-ml/.env`:

```
VITE_USE_MOCK=false
VITE_CHAT_API=http://localhost:8787/api/chat
VITE_TRANSLATE_API=http://localhost:8787/api/translate
```

Without the backend, the assistant falls back to built-in mock responses
(`VITE_USE_MOCK=true`), and document translation is unavailable.

## Known limitations

- **OCR for Somali & Kinyarwanda** has no dedicated Tesseract model; both use the
  English Latin-script model, so accuracy is lower. The extracted-text box is
  editable to correct this before translating.
- **Somali & Kinyarwanda translations** (NLLB) and the **so/rw interface strings**
  in `i18n.js` are machine-assisted and marked for **native-speaker review**
  before production.
- **Voice** works only in Chrome/Edge, and browser speech engines barely support
  Somali/Kinyarwanda.
- **MyMemory**'s free tier has daily rate limits; a dedicated provider may be
  needed at scale.

## Roadmap

- Verify the remaining generic knowledge-base entries (set `last_verified`).
- Rotate the Hugging Face token before any public deployment (a token was once
  committed to git history; it now lives only in `backend/.env`).
- Persist scan analytics beyond localStorage once a datastore is available.
- Native-speaker review of Somali/Kinyarwanda content.
