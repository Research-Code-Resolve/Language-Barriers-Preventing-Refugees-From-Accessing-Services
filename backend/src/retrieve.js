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

// Place names are already handled by the location filter, so treating them as
// keywords just adds noise (every Kakuma entry would "match" the word Kakuma).
const LOCATION_TERMS = new Set(['kakuma', 'kalobeyei', 'bidibidi', 'dadaab']);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t) && !LOCATION_TERMS.has(t));
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
    const relevant = overlap > 0;
    const isCurated = entry.category !== 'document';

    // Only nudge on category when the entry is already topically relevant, so a
    // service-type match can't surface an otherwise-irrelevant entry.
    const categoryBoost = relevant && preferredCategories.includes(entry.category.toLowerCase()) ? 1.5 : 0;

    // Curated entries that are relevant always rank above document passages.
    // Document chunks are long and keyword-rich (a repeated word inflates their
    // score) and would otherwise bury the precise, human-verified curated
    // answers. Documents still lead when NO curated entry is relevant — e.g. a
    // fact that only exists in an uploaded document (an ambulance number, etc.).
    const CURATED_TIER = 100;
    const curatedBoost = relevant && isCurated ? CURATED_TIER : 0;

    return { entry, score: overlap + categoryBoost + curatedBoost };
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
