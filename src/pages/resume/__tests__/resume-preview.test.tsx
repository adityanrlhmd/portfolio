import { render, waitFor } from '@testing-library/react';

import { ADITYA_RESUME } from '@/lib/resume/aditya';

import { ResumePreview } from '../resume-preview';

vi.mock('@react-pdf/renderer', () => ({
  pdf: () => ({ toBlob: async () => new Blob(['%PDF']) }),
  StyleSheet: { create: <T,>(styles: T) => styles },
}));

// jsdom can't run pdf.js; a two-page fake document is enough to check the swap
vi.mock('pdfjs-dist', () => {
  const page = {
    getViewport: ({ scale }: { scale: number }) => ({
      width: 612 * scale,
      height: 792 * scale,
    }),
    render: () => ({ promise: Promise.resolve() }),
  };
  return {
    GlobalWorkerOptions: {},
    getDocument: () => ({
      promise: Promise.resolve({ numPages: 2, getPage: async () => page }),
      destroy: async () => {},
    }),
  };
});

describe('ResumePreview', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:preview');
    URL.revokeObjectURL = vi.fn();
  });

  it('draws every page and keeps them on screen while the next version renders', async () => {
    const { container, rerender } = render(
      <ResumePreview resume={ADITYA_RESUME} />
    );
    const pages = () => container.querySelectorAll('canvas');
    await waitFor(() => expect(pages()).toHaveLength(2));

    rerender(<ResumePreview resume={{ ...ADITYA_RESUME, name: 'Budi' }} />);
    expect(pages()).toHaveLength(2);
    await waitFor(() => expect(pages()).toHaveLength(2));
  });
});
