import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Maps our app's language codes to Tesseract's trained-data codes
export const OCR_LANGUAGES = [
  { code: 'eng', label: 'English' },
  { code: 'ara', label: 'Arabic' },
  { code: 'fra', label: 'French' },
  { code: 'swa', label: 'Swahili' },
  // Somali and Kinyarwanda have no dedicated Tesseract trained-data pack.
  // Both use Latin script, so we fall back to the English model, which can
  // still recognize the letters reasonably well, just without language-specific
  // spelling correction. Review and edit the extracted text if needed.
  { code: 'eng', label: 'Somali (approximate)' },
  { code: 'eng', label: 'Kinyarwanda (approximate)' },
];

function preprocessImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const contrast = avg < 140 ? avg * 0.6 : Math.min(255, avg * 1.3);
        data[i] = data[i + 1] = data[i + 2] = contrast;
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function extractFromImage(file, ocrLang, onProgress) {
  const processed = await preprocessImage(file);
  const { data: { text } } = await Tesseract.recognize(processed, ocrLang, {
    logger: (info) => {
      if (info.status === 'recognizing text') {
        onProgress(Math.round(info.progress * 100));
      }
    },
  });
  return text.trim();
}

export async function extractFromPDF(file, ocrLang, onProgress) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
    onProgress(Math.round((i / pdf.numPages) * 100));
  }

  if (!fullText.trim()) {
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    const { data: { text } } = await Tesseract.recognize(blob, ocrLang, {
      logger: (info) => {
        if (info.status === 'recognizing text') {
          onProgress(Math.round(info.progress * 100));
        }
      },
    });
    fullText = text;
  }

  return fullText.trim();
}

export async function extractFromDOCX(file) {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value.trim();
}

export async function extractText(file, ocrLang, onProgress) {
  const type = file.type;
  const name = file.name.toLowerCase();

  if (type.startsWith('image/')) {
    return extractFromImage(file, ocrLang, onProgress);
  }
  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    return extractFromPDF(file, ocrLang, onProgress);
  }
  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    onProgress(50);
    const text = await extractFromDOCX(file);
    onProgress(100);
    return text;
  }

  throw new Error('Unsupported file type. Please upload an image, PDF, or DOCX file.');
}
