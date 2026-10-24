import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ADITYA_RESUME } from '@/lib/aditya';

import { ResumePreview } from '../resume-preview';

const pdf = vi.hoisted(() =>
  vi.fn<(doc: React.ReactElement) => { toBlob: () => Promise<Blob> }>(() => ({
    toBlob: async () => new Blob(['%PDF']),
  }))
);

vi.mock('@react-pdf/renderer', () => ({
  pdf,
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

  it('opens the PDF without placeholders', async () => {
    const tab = { location: { href: '' }, close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue(tab as unknown as Window);
    render(<ResumePreview resume={ADITYA_RESUME} />);

    await userEvent.click(screen.getByRole('button', { name: 'Open PDF' }));

    await waitFor(() => expect(tab.location.href).toBe('blob:preview'));
    expect(pdf.mock.lastCall?.[0].props).toEqual({ resume: ADITYA_RESUME });
  });
});
