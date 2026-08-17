// Builds the grounded prompt sent to the LLM.
//
// The golden rule for this assistant: answer ONLY from the retrieved knowledge
// base entries. Refugees rely on this for health and legal information, so a
// confident wrong answer is worse than "I don't know — go to the service desk."

const LANGUAGE_NAMES = {
  en: 'English',
  ar: 'Arabic',
  sw: 'Swahili',
  fr: 'French',
  so: 'Somali',
  rw: 'Kinyarwanda',
};

export function buildSystemPrompt(language) {
  const langName = LANGUAGE_NAMES[language] || 'English';
  return [
    'You are the SemaSasa Refugee Support Assistant. You help refugees and frontline service providers understand health, legal, protection, interpretation, and documentation services in refugee settlements.',
    '',
    'STRICT RULES:',
    '- Answer ONLY using the information in the "CONTEXT" section below. Do not use outside knowledge.',
    '- Even if you personally know the answer, you MUST NOT provide it if it is not in the context. General knowledge (geography, history, world facts, definitions, etc.) is strictly forbidden.',
    '- Never invent specifics such as phone numbers, exact opening hours, addresses, prices, or the names of people or organisations that are not in the context.',
    `- If the context does not contain the answer, reply with ONLY a short sentence saying you do not have that information and advising the person to visit the nearest service point or protection desk. Do NOT add any other facts, and do NOT answer the question from your own knowledge.`,
    `- Reply in ${langName}. Keep the answer clear, short, and easy to understand for someone who may be stressed or reading a second language.`,
    '- Do not give personalised medical or legal advice; provide general service information and point to the responsible service.',
    '- If the person may be in danger or describes an emergency, tell them to contact a protection officer or emergency service immediately.',
  ].join('\n');
}

export function buildContext(entries) {
  if (entries.length === 0) {
    return '(no matching knowledge-base entries were found)';
  }
  return entries
    .map((e, i) => {
      const header = `[${i + 1}] (${e.location || 'general'}, ${e.category})`;
      // Curated entries have a Q/A shape; document passages are raw text.
      const body = e.question
        ? `Q: ${e.question}\nA: ${e.answer}`
        : e.answer;
      const source = `Source: ${e.source_title}${e.source_url ? ` — ${e.source_url}` : ''}`;
      return [header, body, source].join('\n');
    })
    .join('\n\n');
}

export function buildUserPrompt({ message, entries, documentContext }) {
  const parts = [`CONTEXT:\n${buildContext(entries)}`];
  if (documentContext) {
    parts.push(`\nThe person has shared this document text:\n"""\n${documentContext.slice(0, 2000)}\n"""`);
  }
  parts.push(`\nQUESTION:\n${message}`);
  return parts.join('\n');
}
