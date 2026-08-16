```markdown
# SemaSasa OCR Analytics

A machine learning-powered feature set that lets health and legal service providers scan physical documents — ID cards, prescriptions, referral forms, legal notices — and instantly extract, translate, and get AI-assisted help understanding them, removing the need for manual retyping across language barriers.

## Overview

Refugees and service providers frequently need to work with physical paperwork written in a language one party doesn't read. This feature extends SemaSasa's language-access mission beyond voice translation: service providers can upload a photo, scanned image, PDF, or Word document, extract its text using an in-browser OCR model, translate it into any of SemaSasa's supported languages, and hand it off to an AI assistant for further help understanding it.

It integrates naturally alongside SemaSasa's existing Health and Legal service flows, giving providers a fast, self-contained way to process paperwork on the spot.

## Features

### Document Scanner
- **Multi-format upload** — photos, scanned images, PDFs, and Word (.docx) documents
- **Automatic text extraction** — OCR for images and scanned PDFs runs entirely in the browser; text-based PDFs and DOCX files are parsed directly for higher accuracy
- **Editable extracted text** — extracted text appears in an editable box so it can be reviewed and corrected before translating, particularly useful for lower-resource languages
- **Multi-language translation** — translate extracted text into English, Arabic, Swahili, French, Somali, or Kinyarwanda
- **Right-to-left support** — Arabic text displays correctly in both extraction and translation views
- **Copy to clipboard** — quickly copy the original or translated text for use elsewhere
- **Scan analytics** — a lightweight activity panel tracks documents scanned today, this week, and in total, providing an early, data-driven view into feature usage

### Refugee Support Assistant
- **Conversational AI assistant** — service providers and refugees can ask questions about health and legal services in their preferred language
- **Context-aware** — responses adapt based on selected location, language, and service type (health or legal)
- **Document handoff** — extracted or translated document text can be sent directly from the Document Scanner into the assistant via "Ask AI about this document," so the assistant can help explain the content
- **Suggested questions** — common questions are surfaced to guide first-time users
- **Escalation pathway** — flags when a user may need direct human support (interpreter, health, or legal/protection contact) and offers next steps
- **Source citation** — responses are labeled as demo or verified, with source attribution built in for when the system connects to a live knowledge backend

## Tech stack

- **Tesseract.js** — client-side OCR engine (WebAssembly-based) for images and scanned PDFs
- **pdfjs-dist** — extracts embedded text directly from PDF files, with OCR fallback for scanned/image-only PDFs
- **mammoth** — extracts text from Word (.docx) documents
- **Backend translation proxy** (`POST /api/translate`) — translation now runs server-side (MyMemory + Hugging Face NLLB) so the API token never reaches the browser. `translate.js` is a thin client to it.
- **localStorage** — scan-event logging for the analytics panel (timestamp only; no document content is stored)
- No dependency on the main app's authentication or database layer

## Analytics

Every completed scan logs a timestamp locally, with no document content retained. The analytics panel surfaces this data as three at-a-glance metrics:

- Documents scanned **today**
- Documents scanned **this week**
- Documents scanned **all time**

This provides a foundation for usage tracking that can later be extended into fuller reporting once connected to persistent storage.

## Design

Visual styling follows the SemaSasa brand palette — a blue-to-teal gradient with clean white surfaces — for a cohesive, professional look consistent with the rest of the app. A shared `theme.js` centralizes colors, typography values, and supported language/location/service lists used across both the Document Scanner and the Assistant.

## File structure

```
src/
  App.jsx                          — top-level tab navigation between Scanner and Assistant
  DocumentScanner.jsx               — OCR upload, extraction, editing, and translation UI
  ScanStats.jsx                     — scan activity analytics panel
  storage.js                        — localStorage helper for scan-event logging
  translate.js                      — thin client to the backend /api/translate endpoint
  speech.js                         — Web Speech API helpers (voice input + read-aloud)
  fileReaders.js                    — OCR, PDF, and DOCX extraction logic
  theme.js                          — shared design tokens and supported language/location/service lists
  main.jsx                          — app entry point
  assistant/
    RefugeeSupportAssistant.jsx     — main assistant chat interface
    ChatInput.jsx                   — message input, with document attach and voice input (Web Speech API)
    chatService.js                  — chat request handler (RAG backend via VITE_USE_MOCK/VITE_CHAT_API; mock fallback)
    mockResponses.js                — demo response content, keyed by language and topic
    MessageBubble.jsx               — chat message rendering
    SourceCitation.jsx              — demo/verified response labeling
    SafetyNotice.jsx                — safety disclaimer and escalation prompt
    Selectors.jsx                   — location, language, and service type selectors
    SuggestedQuestions.jsx          — starter question prompts
    icons.jsx                       — shared inline SVG icon set
```

## Known limitations

- Somali and Kinyarwanda have no dedicated OCR trained-data model in Tesseract.js. Both are approximated using the English Latin-script model, which reads the correct letters but without language-specific word correction — extraction accuracy for these two languages will be lower than for English, Arabic, French, or Swahili. The extracted text box is editable so this can be corrected manually before translating.
- Translation for Somali and Kinyarwanda routes through Hugging Face's hosted NLLB model, which may take 10–20 seconds to respond on first use after a period of inactivity, while the hosted model loads.
- The MyMemory API's free tier has daily rate limits; production use at scale may warrant a dedicated translation provider.
- The Refugee Support Assistant can run against the RAG backend (`backend/`, `POST /api/chat`) or fall back to built-in mock responses, controlled by `VITE_USE_MOCK` / `VITE_CHAT_API`.

## Roadmap

- Replace `storage.js`'s localStorage logic with a persistent `document_scans` table once connected to a backend — no changes needed elsewhere in the feature
- Expand analytics with breakdowns by document type or language pair
- Rotate the Hugging Face token before any public deployment (a token was previously committed to git history; it now lives only in `backend/.env`)

## Usage

```
npm install
npm run dev
```
```