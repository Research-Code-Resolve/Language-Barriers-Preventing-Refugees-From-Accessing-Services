# SemaSasa Backend

Server-side logic for the SemaSasa Refugee Support Assistant. It provides the
**RAG chat** pipeline and a **translation proxy**, so that no API keys ever
reach the browser.

## Why a backend

- The chatbot answers must be **grounded** in a verified knowledge base, not
  invented — the LLM only sees retrieved knowledge-base entries.
- Secrets (the Hugging Face token) must stay **server-side**. Anything put in a
  frontend `VITE_` variable is shipped to the browser.

## Endpoints

### `POST /api/chat`
Retrieval-augmented chat.

Request:
```json
{ "message": "Where can I get legal help?", "language": "en",
  "location": "bidibidi", "serviceType": "legal", "documentContext": null }
```
Response:
```json
{ "answer": "…", "sources": ["Legal Assistance - UNHCR Help Uganda"],
  "verified": false, "mode": "extractive" }
```
- `verified` is `true` only when every grounding entry has been human-verified
  (`last_verified` set in the knowledge base). The UI shows "Demo response"
  otherwise.
- `mode` is `generated` (an LLM wrote the answer) or `extractive` (no LLM
  configured — the top knowledge-base answer is returned verbatim).

### `POST /api/translate`
Server-side translation (MyMemory for high-resource pairs, Meta NLLB via
Hugging Face for Somali/Kinyarwanda, with automatic fallback).

Request: `{ "text": "…", "sourceLang": "en", "targetLang": "fr" }`
Response: `{ "translatedText": "…" }`

### `GET /api/health`
`{ "ok": true, "entries": 24, "llm": { "provider": "…", "model": "…" } }`

## How retrieval works

The knowledge base (`../data-ml/refugee_knowledge_base.csv`) is small, so there
is **no vector database**. `src/retrieve.js` filters by location, scores
candidates by keyword overlap, and boosts entries whose category matches the
requested service type ("Legal & Protection" covers legal + GBV + child
protection). Swap in embeddings here later if the KB grows large.

## LLM providers

Set `LLM_PROVIDER` in `.env` (see `.env.example`):

| Provider | Notes |
|---|---|
| `huggingface` | Open-source model hosted on HF. **Recommended** — no local hardware, model runs in the cloud. Needs `HF_TOKEN`. |
| `ollama` | Same class of open-source model, running locally (offline, no key, needs a capable machine). |
| `anthropic` / `openai` | Hosted commercial APIs (need a key). Any OpenAI-compatible endpoint works via `OPENAI_BASE_URL`. |
| `none` | Extractive mode — returns the top KB answer, no generation. Runs with nothing installed. |

The default model is `Qwen/Qwen2.5-7B-Instruct` (good multilingual coverage).
Note: even large models are weak on Somali/Kinyarwanda; NLLB remains more
reliable for pure translation of those languages.

## Running locally

```bash
cd backend
cp .env.example .env      # then fill in HF_TOKEN if you want generation
npm install
npm start                 # http://localhost:8787
```

Without a token the server still runs in extractive mode. To point the frontend
at this backend, set in `data-ml/.env`:
```
VITE_USE_MOCK=false
VITE_CHAT_API=http://localhost:8787/api/chat
VITE_TRANSLATE_API=http://localhost:8787/api/translate
```

## Knowledge base

Content is **curated, not scraped**: official pages (help.unhcr.org, etc.) are
read and hand-written into structured CSV rows with `source_url`. An entry only
counts as verified once a human fills its `last_verified` field. See the entries
in `../data-ml/refugee_knowledge_base.csv`.

## Security

- Never commit `.env` or real tokens (`.gitignore` covers `.env`).
- The Hugging Face token lives only here, server-side — never in the frontend.
