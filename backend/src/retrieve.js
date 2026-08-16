// Retrieval for the RAG pipeline.
//
// The knowledge base is small (tens of entries), so we do NOT need a vector
// database. We filter by metadata (location) and rank candidates by keyword
// overlap, boosting entries whose category matches the requested service type.
// This is deterministic, dependency-free, and easy to reason about. Swap in
// embeddings here later if the KB grows large.

const STOPWORDS = new Set([
  'the', 'a', 'an', 'to', 'in', 'on', 'at', 'of', 'for', 'and', 'or', 'is',
  'are', 'i', 'can', 'how', 'where', 'do', 'my', 'me', 'get', 'you', 'your',
  'what', 'should', 'about', 'with', 'need', 'help', 'please',
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// Map the UI's serviceType to knowledge-base categories. The UI groups
// "Legal & Protection" as one service, so legal also covers protection
// categories (GBV, child protection).
const SERVICE_TO_CATEGORIES = {
  health: ['health'],
  legal: ['legal', 'gbv', 'child_protection'],
};

export function retrieve(entries, { message, location, serviceType }, topK = 4) {
  const queryTokens = new Set(tokenize(message));
  const loc = (location || '').toLowerCase();
  const preferredCategories = SERVICE_TO_CATEGORIES[serviceType] || [];

  // Location filter: keep entries for this location; if the user picked
  // "other" or an unknown location, keep everything.
  const known = ['kakuma', 'bidibidi'];
  const locationScoped = known.includes(loc)
    ? entries.filter((e) => e.location.toLowerCase() === loc)
    : entries;

  const scored = locationScoped.map((entry) => {
    const haystack = tokenize(`${entry.question} ${entry.answer} ${entry.category}`);
    let overlap = 0;
    for (const tok of haystack) {
      if (queryTokens.has(tok)) overlap++;
    }
    const categoryBoost = preferredCategories.includes(entry.category.toLowerCase()) ? 1.5 : 0;
    return { entry, score: overlap + categoryBoost };
  });

  scored.sort((a, b) => b.score - a.score);

  // Keep only entries with some signal; if nothing scored, fall back to the
  // category-matched entries for the location so we still ground the answer.
  let hits = scored.filter((s) => s.score > 0).slice(0, topK);
  if (hits.length === 0) {
    hits = scored
      .filter((s) => preferredCategories.includes(s.entry.category.toLowerCase()))
      .slice(0, topK);
  }

  return hits.map((h) => h.entry);
}
