import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Toaster } from '@/components/ui/sonner';

import { ADITYA_RESUME } from '@/lib/aditya';
import {
  ADITYA_COVER_LETTER,
  STORAGE_KEY,
  applicationEmail,
  encodeCoverLetter,
  loadCoverLetter,
  newCoverLetter,
  paragraphs,
  signatureLinks,
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

  it("switches today's date with the PDF language, but leaves a typed date alone", async () => {
    render(<CoverLetterPage />);
    const date = screen.getByLabelText('Date');
    const pdfLang = screen.getByRole('group', { name: 'PDF language' });
    const today = (locale: string) =>
      new Date().toLocaleDateString(locale, { dateStyle: 'long' });

    await user.click(within(pdfLang).getByRole('button', { name: 'ID' }));
    expect(date).toHaveValue(today('id-ID'));
    expect(localStorage.getItem('pdf-lang')).toBe('id');

    await user.clear(date);
    await user.type(date, '1 Mei 2026');
    await user.click(within(pdfLang).getByRole('button', { name: 'EN' }));
    expect(date).toHaveValue('1 Mei 2026');
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

  it('saves the last keystrokes when the visitor leaves right away', () => {
    render(<CoverLetterPage />);
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { value: 'Acme' },
    });
    window.dispatchEvent(new Event('pagehide'));
    expect(loadCoverLetter()?.company).toBe('Acme');
  });

  it('copies the email subject', async () => {
    render(
      <>
        <Toaster />
        <CoverLetterPage />
      </>
    );
    await user.type(screen.getByLabelText('Position'), 'Designer');
    await user.type(
      screen.getByLabelText('Full name'),
      '{Control>}a{/Control}Sari'
    );
    await user.click(screen.getByRole('button', { name: 'Email to HR' }));
    expect(
      await screen.findByText('Application for Designer – Sari')
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Copy subject' }));
    expect(await navigator.clipboard.readText()).toBe(
      'Application for Designer – Sari'
    );
    expect(await screen.findByText('Copied.')).toBeInTheDocument();
  });

  it('puts the letter in the email until the visitor picks attached, and remembers it', async () => {
    const { unmount } = render(<CoverLetterPage />);
    await user.type(screen.getByLabelText('Letter'), 'My pitch.');
    await user.click(screen.getByRole('button', { name: 'Email to HR' }));
    const attached = () => screen.getByRole('button', { name: 'Attached' });
    expect(attached()).toHaveAttribute('aria-pressed', 'false');
    expect(await screen.findByText(/My CV is attached/)).toBeInTheDocument();

    await user.click(attached());
    expect(screen.getByText(/- Cover letter/)).toBeInTheDocument();
    unmount();
    render(<CoverLetterPage />);
    await user.click(screen.getByRole('button', { name: 'Email to HR' }));
    expect(attached()).toHaveAttribute('aria-pressed', 'true');
  });

  it('resets to a blank letter after confirming, sender included', async () => {
    saveResume(ADITYA_RESUME);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<CoverLetterPage />);
    await user.type(screen.getByLabelText('Company'), 'Acme');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByLabelText('Company')).toHaveValue('');
    expect(screen.getByLabelText('Full name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');

    // a reset letter counts as untouched, so filling it doesn't ask again
    confirm.mockClear();
    await user.click(
      screen.getByRole('button', { name: "Fill with Aditya's data" })
    );
    expect(confirm).not.toHaveBeenCalled();
  });
});

describe('applicationEmail', () => {
  const letter = {
    ...newCoverLetter(),
    name: 'Budi',
    email: 'budi@mail.com',
    phone: '',
    role: 'Frontend Engineer',
    company: 'Acme',
    body: 'My pitch.\n\nMy work.\n\nThank you.',
  };

  it('fills in the job and sender, and shows placeholders for what is missing', () => {
    const id = applicationEmail({ ...letter, body: '' }, 'id');
    expect(id.subject).toBe('Lamaran Frontend Engineer – Budi');
    // no recipient but a company: the company's team is greeted
    expect(id.body).toMatch(/^Yth\. Tim HRD Acme,/);
    expect(id.body).toContain('posisi Frontend Engineer di Acme');
    // with no letter yet, a stock line stands in for the pitch
    expect(id.body).toContain('Saya yakin pengalaman saya');
    // empty phone is left out, not shown as a placeholder
    expect(id.body).toMatch(/Hormat saya,\nBudi\nbudi@mail\.com$/);

    const en = applicationEmail({ ...letter, role: '' }, 'en');
    expect(en.subject).toBe('Application for Job Title – Budi');
  });

  it('drops the company when it is empty', () => {
    const body = applicationEmail({ ...letter, company: '' }, 'id').body;
    expect(body).toMatch(/^Yth\. Bapak\/Ibu HRD,/);
    expect(body).toContain('lamaran untuk posisi Frontend Engineer.');
    expect(body).toContain('kontribusi yang bisa saya berikan.');
    expect(body).not.toContain('Nama Perusahaan');
  });

  it('borrows the first paragraph when the letter is attached, and the whole letter when inline', () => {
    const attached = applicationEmail(letter, 'en').body;
    expect(attached).toContain("at Acme.\n\nMy pitch.\n\nI've attached");
    expect(attached).not.toContain('My work.');

    const inline = applicationEmail(letter, 'en', {
      inline: true,
      links: 'linkedin.com/in/budi',
    }).body;
    expect(inline).toContain(
      'at Acme. My CV is attached for your review.\n\nMy pitch.\n\nMy work.\n\nThank you.\n\nBest regards,'
    );
    expect(inline).toMatch(/budi@mail\.com\nlinkedin\.com\/in\/budi$/);
  });
});

describe('signatureLinks', () => {
  beforeEach(() => localStorage.clear());

  it("takes the links of the resume whose name matches the sender's", () => {
    saveResume({ ...ADITYA_RESUME, name: 'Budi', links: 'github.com/budi' });
    expect(signatureLinks('Budi')).toBe('github.com/budi');
    expect(signatureLinks(ADITYA_RESUME.name)).toBe(ADITYA_RESUME.links);
    expect(signatureLinks('Someone else')).toBe('');
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
