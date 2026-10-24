import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Toaster } from '@/components/ui/sonner';

import { ADITYA_RESUME } from '@/lib/aditya';
import {
  ADITYA_COVER_LETTER,
  STORAGE_KEY,
  encodeCoverLetter,
  loadCoverLetter,
  newCoverLetter,
  paragraphs,
} from '@/lib/cover-letter';
import { saveResume } from '@/lib/resume/storage';

import CoverLetterPage from '../cover-letter-page';

// Only the page behavior matters here, not the PDF itself.
vi.mock('@react-pdf/renderer', () => {
  const Stub = () => null;
  return {
    pdf: () => ({ toBlob: async () => new Blob(['%PDF']) }),
    StyleSheet: { create: <T,>(styles: T) => styles },
    Document: Stub,
    Page: Stub,
    View: Stub,
    Text: Stub,
  };
});

describe('CoverLetterPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
    URL.createObjectURL = vi.fn(() => 'blob:preview');
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());

  it('fills the sender details from the saved resume', () => {
    saveResume(ADITYA_RESUME);
    render(<CoverLetterPage />);
    expect(screen.getByLabelText('Full name')).toHaveValue(ADITYA_RESUME.name);
    expect(screen.getByLabelText('Email')).toHaveValue(ADITYA_RESUME.email);
    expect(screen.getByLabelText('Company')).toHaveValue('');
  });

  it('keeps what was typed after a reload', async () => {
    const { unmount } = render(<CoverLetterPage />);
    await user.type(screen.getByLabelText('Company'), 'Acme');
    await vi.waitFor(() =>
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).company).toBe(
        'Acme'
      )
    );
    unmount();
    render(<CoverLetterPage />);
    expect(screen.getByLabelText('Company')).toHaveValue('Acme');
  });

  it("fills Aditya's letter and keeps the date", async () => {
    render(<CoverLetterPage />);
    const date = (screen.getByLabelText('Date') as HTMLInputElement).value;
    await user.click(
      screen.getByRole('button', { name: "Fill with Aditya's data" })
    );
    expect(screen.getByLabelText('Full name')).toHaveValue(
      ADITYA_COVER_LETTER.name
    );
    expect(screen.getByLabelText('Letter')).toHaveValue(
      ADITYA_COVER_LETTER.body
    );
    expect(screen.getByLabelText('Date')).toHaveValue(date);
  });

  it('imports a cover letter PDF made here, and rejects others', async () => {
    render(
      <>
        <Toaster />
        <CoverLetterPage />
      </>
    );
    const upload = (text: string) =>
      user.upload(
        screen.getByLabelText('Import PDF'),
        new File([text], 'letter.pdf', { type: 'application/pdf' })
      );

    await upload('%PDF-1.4 hi');
    expect(
      await screen.findByText(
        'Only cover letters made with this generator can be imported.'
      )
    ).toBeInTheDocument();

    // the mocked renderer can't embed data, so build the marker by hand
    const saved = { ...newCoverLetter(), company: 'Acme' };
    await upload(`%PDF (${encodeCoverLetter(saved)})`);
    expect(await screen.findByLabelText('Company')).toHaveValue('Acme');
  });

  it('links to the resume builder', () => {
    render(<CoverLetterPage />);
    expect(
      screen.getByRole('link', { name: 'Resume Builder' })
    ).toHaveAttribute('href', '/resume');
  });

  it('saves the last keystrokes when the visitor leaves right away', () => {
    render(<CoverLetterPage />);
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { value: 'Acme' },
    });
    window.dispatchEvent(new Event('pagehide'));
    expect(loadCoverLetter()?.company).toBe('Acme');
  });

  it('resets to a fresh letter after confirming', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<CoverLetterPage />);
    await user.type(screen.getByLabelText('Company'), 'Acme');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByLabelText('Company')).toHaveValue('');
  });
});

describe('paragraphs', () => {
  it('splits on blank lines and drops empty ones', () => {
    expect(paragraphs('One\nstill one\n\n  \n\nTwo\n\n')).toEqual([
      'One\nstill one',
      'Two',
    ]);
  });
});
