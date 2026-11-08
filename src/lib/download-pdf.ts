import { type DocumentProps, pdf } from '@react-pdf/renderer';

import type { ReactElement } from 'react';

// Not in utils.ts, which every page loads: this pulls in the PDF library.
export const downloadPdf = async (
  document: ReactElement<DocumentProps>,
  filename: string
) => {
  const blob = await pdf(document).toBlob();
  // iOS Safari previews an application/pdf blob in a new page instead of saving it
  const url = URL.createObjectURL(
    new Blob([blob], { type: 'application/octet-stream' })
  );
  const link = window.document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  // Safari can start the download well after click() returns
  setTimeout(() => URL.revokeObjectURL(url), 40_000);
};
