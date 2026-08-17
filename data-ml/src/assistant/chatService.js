// Chat service — the single entry point for sending a message and getting a response.
// Currently uses the mock response engine. When the backend is ready, replace the
// implementation of `sendChatMessage` with a fetch to POST /api/chat.
//
// Expected future request shape:
//   { message, language, location, serviceType, documentContext }
//
// Expected future response shape:
//   { answer, sources: [], verified: true }
//
// Until then, the mock engine returns:
//   { text, source, isDemo: true, verified: false }

import { getAssistantResponse } from './mockResponses';

// Endpoint of the RAG backend. Defaults to same-origin /api/chat; override with
// VITE_CHAT_API (e.g. http://localhost:8787/api/chat during local development).
const API_ENDPOINT = import.meta.env.VITE_CHAT_API || '/api/chat';

// Mock stays ON by default so the app runs standalone. Set VITE_USE_MOCK=false
// (with the backend running) to route messages to the real RAG pipeline.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export async function sendChatMessage({ message, language, location, serviceType, documentContext = null }) {
  if (USE_MOCK) {
    return mockSendChatMessage({ message, language, location, serviceType, documentContext });
  }

  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language,
      location,
      serviceType,
      documentContext,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed (${res.status})`);
  }

  const data = await res.json();
  return {
    text: data.answer,
    source: data.sources?.length ? data.sources.join(', ') : null,
    isDemo: false,
    verified: data.verified === true,
  };
}

async function mockSendChatMessage({ message, language, serviceType, documentContext }) {
  const response = getAssistantResponse(message, {
    language,
    serviceType,
    hasDocumentText: !!documentContext,
  });
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 600));
  return response;
}
