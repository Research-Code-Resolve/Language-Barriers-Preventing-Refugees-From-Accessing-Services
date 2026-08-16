// Ingests source documents (Word, PDF, txt/markdown) from the knowledge_base/
// documents folder into retrievable passages, alongside the curated CSV.
//
// Drop a file in the folder and restart the server — it becomes searchable.
// No manual CSV writing needed. These passages are unverified raw source text,
// so they are always verified:false (shown as "Demo" until curated/reviewed).

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, basename } from 'node:path';

import mammoth from 'mammoth';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DOCS_DIR = resolve(__dirname, '../../knowledge_base/documents');

// Roughly map a source filename to one of the app's known locations so the
// location filter still works on document passages.
function inferLocation(fileName) {
  const n = fileName.toUpperCase();
  if (n.includes('KENYA') || n.includes('KAKUMA')) return { country: 'Kenya', location: 'Kakuma' };
  if (n.includes('UGANDA') || n.includes('BIDIBIDI')) return { country: 'Uganda', location: 'Bidibidi' };
  return { country: '', location: '' };
}

async function extractText(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.docx') {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  }
  if (ext === '.pdf') {
    const { text } = await pdfParse(readFileSync(filePath));
    return text;
  }
  if (ext === '.txt' || ext === '.md') {
    return readFileSync(filePath, 'utf8');
  }
  return null; // unsupported type
}

// Split text into ~900-char passages on paragraph boundaries so each retrieved
// chunk is self-contained but not too large for the prompt.
function chunk(text, maxLen = 900) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const chunks = [];
  let current = '';
  for (const p of paragraphs) {
    if (current && current.length + p.length + 1 > maxLen) {
      chunks.push(current);
      current = '';
    }
    current = current ? `${current} ${p}` : p;
    // A single very long paragraph is emitted on its own.
    if (current.length > maxLen) {
      chunks.push(current);
      current = '';
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function loadDocuments(docsDir = process.env.DOCS_DIR || DEFAULT_DOCS_DIR) {
  const dir = resolve(docsDir);
  if (!existsSync(dir)) {
    console.log(`[docs] no documents folder at ${dir} (skipping)`);
    return [];
  }

  const files = readdirSync(dir).filter(
    (f) => !f.startsWith('~$') && ['.docx', '.pdf', '.txt', '.md'].includes(extname(f).toLowerCase()),
  );

  const entries = [];
  for (const file of files) {
    try {
      const text = await extractText(resolve(dir, file));
      if (!text || !text.trim()) continue;

      const { country, location } = inferLocation(file);
      const name = basename(file, extname(file));

      chunk(text).forEach((passage, i) => {
        entries.push({
          id: `DOC-${name}-${i + 1}`,
          country,
          location,
          category: 'document',
          question: '',
          answer: passage,
          organisation: '',
          source_title: `${file} (uploaded document)`,
          source_url: '',
          language: 'English',
          last_verified: '',
          verified: false,
        });
      });
    } catch (err) {
      console.warn(`[docs] failed to read ${file}: ${err.message}`);
    }
  }

  console.log(`[docs] loaded ${entries.length} passages from ${files.length} document(s) in ${dir}`);
  return entries;
}
