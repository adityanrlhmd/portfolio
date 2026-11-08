import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

// All the text in a PDF, one line per page. Empty for a scan, which is only images.
export const pdfText = async (bytes: ArrayBuffer) => {
  const task = getDocument({ data: bytes });
  try {
    const doc = await task.promise;
    const pages: string[] = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const content = await (await doc.getPage(n)).getTextContent();
      pages.push(
        content.items.map(item => ('str' in item ? item.str : '')).join(' ')
      );
    }
    return pages.join('\n').trim();
  } finally {
    await task.destroy();
  }
};
