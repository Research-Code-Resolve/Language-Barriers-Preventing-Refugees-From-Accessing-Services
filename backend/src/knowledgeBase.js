// Loads the refugee knowledge base from CSV into memory.
// No external CSV library — a small RFC-4180-style parser handles quoted
// fields that contain commas, quotes, or newlines.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_KB_PATH = resolve(__dirname, '../knowledge_base/refugee_knowledge_base.csv');

// Parse a full CSV string into an array of row-arrays.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++; // escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      // Handle CRLF and lone CR/LF; only close a row when we have content.
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }

  // Flush trailing field/row (file may not end with a newline).
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0].trim() !== ''));
}

export function loadKnowledgeBase(kbPath = process.env.KB_PATH || DEFAULT_KB_PATH) {
  const absolute = resolve(kbPath);
  const text = readFileSync(absolute, 'utf8');
  const rows = parseCsv(text);

  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim());
  const entries = rows.slice(1).map((cols) => {
    const entry = {};
    header.forEach((key, i) => {
      entry[key] = (cols[i] ?? '').trim();
    });
    // An entry is only "verified" once a human has stamped last_verified.
    entry.verified = Boolean(entry.last_verified && entry.last_verified.length > 0);
    return entry;
  });

  console.log(`[kb] loaded ${entries.length} entries from ${absolute}`);
  return entries;
}
