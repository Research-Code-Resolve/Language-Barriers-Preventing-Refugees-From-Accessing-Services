# Knowledge Base

Source of truth for the chatbot's answers. It has two layers, both searched by
the backend RAG pipeline:

## 1. `refugee_knowledge_base.csv` — curated Q&A (high precision)

Hand-written, structured entries, one per row:

```
id, country, location, category, question, answer,
organisation, source_title, source_url, language, last_verified
```

- Use these for the most important, exact answers (helplines, procedures).
- An entry counts as **verified** only once a human fills `last_verified`
  (date). Until then the UI shows "Demo response". This is how we avoid giving
  refugees unverified or wrong information.

## 2. `documents/` — dropped source documents (broad coverage)

Drop a file here and **restart the backend** — it is automatically extracted,
split into passages, and made searchable. No coding, no CSV editing.

- Supported: **.docx**, **.pdf**, **.txt**, **.md**
- Name files with the country or camp so the location filter works, e.g.
  `UNHCR_KENYA.docx` → tagged Kenya/Kakuma, `UNHCR_UGANDA.docx` → Uganda/Bidibidi.
- Passages are raw source text, so they are always shown as unverified ("Demo")
  until promoted into curated CSV entries or reviewed.

### Workflow
1. Paste official information into a Word/PDF/txt file (or export a page).
2. Drop it in `documents/`.
3. Restart the backend (`cd backend && npm start`).
4. Ask the assistant — answers can now draw on the new document.

For the highest-value, most-repeated questions, promote the best passages into
curated CSV rows (with `source_url` and, after review, `last_verified`).
