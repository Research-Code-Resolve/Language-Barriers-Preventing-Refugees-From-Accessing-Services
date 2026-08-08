# SemaSasa Frontend

The frontend for **SemaSasa**, a voice-to-voice translation tool that helps frontline **health and legal service providers** communicate with refugees across language barriers.

## Frontend Scope

The frontend covers the following MVP experiences:

- Sign in
- Service selection
  - Health
  - Legal
- Language selection
- Voice-to-voice translation
- Human interpreter escalation
- Interpreter request form
  - Refugee name
  - Additional context/details
- Responsive mobile and desktop interface

## Voice-to-Voice Translation

Voice-to-voice translation is the core SemaSasa experience.

The service provider speaks in their selected language. SemaSasa translates the speech into the refugee's selected language and plays the translation as spoken audio.

The refugee can respond in their language, and SemaSasa translates the speech into the service provider's language and plays the translated audio.

SemaSasa does **not** record or store the conversation.

## MVP Exclusions

The frontend does not include:

- Emergency communication
- Separate refugee account flow
- Conversation recording
- Conversation history
- Full conversation transcript storage
- Dark/light mode
- Features outside the agreed MVP scope

## Tech Stack

- React.js
- Tailwind CSS
- Vite
- JavaScript

## Getting Started

From the frontend code directory:

```bash
cd frontend-code
npm install
npm run dev
