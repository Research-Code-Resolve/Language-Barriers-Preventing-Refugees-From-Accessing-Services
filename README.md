# PROBLEM 6: LANGUAGE BARRIERS PREVENTING REFUGEES FROM ACCESSING SERVICES

## The Problem:
Refugees resettled in urban and semi-urban areas frequently face severe language barriers when trying to access health, legal, education, and livelihood services. Interpreters are expensive, scarce, and unavailable at the point of service. This results in exclusion, misdiagnosis, and infringement of rights.
Frontline service providers, including health workers, legal aid officers, and school enrollment staff, have no accessible, real-time translation tool that supports the primary languages spoken by refugee populations, such as Somali and Kiswahili.
## What's built so far
**SemaSasa** — a document scanner + a multilingual RAG chatbot for frontline
service providers:
- **Document Scanner** (`data-ml/`): in-browser OCR (Tesseract) that extracts and
  translates text from photos, PDFs, and Word documents.
- **Refugee Support Assistant** (`data-ml/`): a RAG chatbot that answers health,
  legal, protection and documentation questions in the user's language (voice
  input + read-aloud, localised UI, RTL Arabic), grounded in a verified
  knowledge base.
- **Backend** (`backend/`): a Node/Express API providing the RAG chat
  (`POST /api/chat`) and a translation proxy (`POST /api/translate`), keeping the
  translation/LLM token server-side.
- **Knowledge base** (`knowledge_base/`): curated Q&A entries plus dropped-in
  source documents (Word/PDF/txt) that are ingested automatically.

Supported languages: English, Arabic, Swahili, French, Somali, Kinyarwanda.
Coverage focuses on Kakuma (Kenya) and Bidibidi (Uganda).

## Repo Structure
This repo is organized by track:
- `/backend` — Node/Express RAG chat + translation API (see `backend/README.md`)
- `/knowledge_base` — curated CSV + ingested documents for the chatbot
- `/data-ml` — Document Scanner + Refugee Support Assistant frontend, plus data analysis
- `/frontend` — SemaSasa voice-translation frontend (separate track)
- `/project-docs` — research background, meeting notes, onboarding material
- `/mobile` — mobile implementation, if the WG's solution includes a mobile component

See each folder's README for track-specific details.
## Who Is Affected:
Refugees and the service providers trying to support them.
## Where Technology Could Help:
An AI-assisted, community-validated translation tool or voice-based service guide targeting two to three key languages and service types.
 
