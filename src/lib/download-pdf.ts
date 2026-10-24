import { type DocumentProps, pdf } from '@react-pdf/renderer';

import type { ReactElement } from 'react';

// Not in utils.ts, which every page loads: this pulls in the PDF library.
export const downloadPdf = async (
  document: ReactElement<DocumentProps>,
  filename: string
) => {
  const blob = await pdf(document).toBlob();
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  // some browsers start the download after click() returns
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
