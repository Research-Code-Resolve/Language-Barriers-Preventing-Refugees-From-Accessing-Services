// Provider-agnostic LLM layer.
//
// Choose the provider with LLM_PROVIDER:
//   huggingface — open-source model (Llama, Qwen, Mistral...) hosted on the
//                 Hugging Face Inference API. No local hardware; needs an HF
//                 token. Best fit for resource-limited deployments — the model
//                 runs in the cloud, the refugee's device only runs a browser.
//   ollama      — the same class of open-source model, but running LOCALLY via
//                 Ollama. No key, works offline, but needs a capable machine.
//   openai      — hosted OpenAI-compatible API (needs a key).
//   none        — or a failed/absent provider — runs in EXTRACTIVE mode: no
//                 generation, just returns the top knowledge-base answer, so
//                 the pipeline stays demonstrable with nothing installed.
//
// Any OpenAI-compatible endpoint (Groq, Together, self-hosted vLLM, ...) also
// works through the "openai" provider by setting OPENAI_BASE_URL.

const PROVIDER = (process.env.LLM_PROVIDER || 'none').toLowerCase();
const MODEL = process.env.LLM_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

const OLLAMA_URL = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');
const OPENAI_BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const HF_BASE_URL = (process.env.HF_BASE_URL || 'https://router.huggingface.co/v1').replace(/\/$/, '');

// Open-source model hosted on the Hugging Face Inference API (OpenAI-compatible
// "router" endpoint). The model runs in the cloud — no local hardware needed.
async function callHuggingFace({ system, user }) {
  const res = await fetch(`${HF_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Hugging Face error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// Open-source model running locally via Ollama (https://ollama.com).
async function callOllama({ system, user }) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      options: { temperature: 0.2 },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.message?.content?.trim() || '';
}

async function callOpenAI({ system, user }) {
  const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// Extractive fallback: return the best-matching entry's answer directly.
function extractiveAnswer(entries) {
  if (entries.length === 0) {
    return "I don't have information on that yet. Please visit the nearest service point or protection desk for help.";
  }
  return entries[0].answer;
}

// Returns { text, mode } where mode is 'generated' or 'extractive'.
export async function generateAnswer({ system, user, entries }) {
  const hasHuggingFace = PROVIDER === 'huggingface' && process.env.HF_TOKEN;
  const isOllama = PROVIDER === 'ollama';
  const hasOpenAI = PROVIDER === 'openai' && process.env.OPENAI_API_KEY;

  try {
    if (hasHuggingFace) {
      return { text: await callHuggingFace({ system, user }), mode: 'generated' };
    }
    if (isOllama) {
      return { text: await callOllama({ system, user }), mode: 'generated' };
    }
    if (hasOpenAI) {
      return { text: await callOpenAI({ system, user }), mode: 'generated' };
    }
  } catch (err) {
    console.warn(`[llm] generation failed, falling back to extractive: ${err.message}`);
    return { text: extractiveAnswer(entries), mode: 'extractive' };
  }

  // provider === 'none' or no key configured
  return { text: extractiveAnswer(entries), mode: 'extractive' };
}

export function llmStatus() {
  return { provider: PROVIDER, model: MODEL };
}
