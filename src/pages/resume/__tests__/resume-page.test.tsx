import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Toaster } from '@/components/ui/sonner';

import { encodeResume } from '@/lib/resume/embed';
import { EMPTY_RESUME } from '@/lib/resume/schema';
import { saveResume } from '@/lib/resume/storage';

import ResumePage from '../resume-page';

// the app shell renders the Toaster; the page alone needs one to show toasts
const renderPage = () =>
  render(
    <>
      <Toaster />
      <ResumePage />
    </>
  );

// Rendering real PDFs is covered by embed.test.tsx; here only the page behavior matters.
vi.mock('@react-pdf/renderer', () => {
  const Stub = () => null;
  return {
    pdf: () => ({ toBlob: async () => new Blob(['%PDF']) }),
    StyleSheet: { create: <T,>(styles: T) => styles },
    Document: Stub,
    Page: Stub,
    View: Stub,
    Text: Stub,
    Link: Stub,
    Image: Stub,
  };
});

const blankExperience = {
  company: '',
  location: '',
  duration: '',
  role: '',
  description: '',
  bullets: '',
};

const fullName = () => screen.getByLabelText('Full name');

describe('ResumePage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
    URL.createObjectURL = vi.fn(() => 'blob:preview');
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());

  it('starts blank', () => {
    renderPage();
    expect(fullName()).toHaveValue('');
  });

  it("fills Aditya's data on click", async () => {
    renderPage();
    await user.click(
      screen.getByRole('button', { name: "Fill with Aditya's data" })
    );
    expect(fullName()).toHaveValue('Aditya Nurul Hamda');
  });

  it('asks before overwriting typed data, keeps it on cancel', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPage();
    await user.type(fullName(), 'Budi');
    await user.click(
      screen.getByRole('button', { name: "Fill with Aditya's data" })
    );
    expect(window.confirm).toHaveBeenCalled();
    expect(fullName()).toHaveValue('Budi');
  });

  it('links to the cover letter', () => {
    renderPage();
    expect(screen.getByRole('link', { name: 'Cover Letter' })).toHaveAttribute(
      'href',
      '/cover-letter'
    );
  });

  it('restores saved progress', () => {
    saveResume({ ...EMPTY_RESUME, name: 'Sari' });
    renderPage();
    expect(fullName()).toHaveValue('Sari');
  });

  it('rejects a PDF not made here and leaves the form alone', async () => {
    renderPage();
    await user.upload(
      screen.getByLabelText('Import PDF'),
      new File(['%PDF-1.4 hi'], 'cv.pdf', { type: 'application/pdf' })
    );
    expect(
      await screen.findByText(
        'Only resumes made with this generator can be imported.'
      )
    ).toBeInTheDocument();
    expect(fullName()).toHaveValue('');
  });

  it('warns when storage is blocked from the start', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    renderPage();
    expect(
      await screen.findByText("Couldn't save your progress in this browser.")
    ).toBeInTheDocument();
  });

  it('asks before an import replaces typed data, keeps it on cancel', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPage();
    await user.type(fullName(), 'Budi');
    // the mocked renderer can't embed data, so build the marker by hand
    const exported = `%PDF (${encodeResume({ ...EMPTY_RESUME, name: 'Old' })})`;
    await user.upload(
      screen.getByLabelText('Import PDF'),
      new File([exported], 'old.pdf', { type: 'application/pdf' })
    );
    expect(window.confirm).toHaveBeenCalled();
    expect(fullName()).toHaveValue('Budi');
  });

  it('moves a collapsed experience down with the keyboard and keeps edits on the right item', async () => {
    saveResume({
      ...EMPTY_RESUME,
      experiences: [
        { ...blankExperience, company: 'A', role: 'Dev' },
        { ...blankExperience, company: 'B', role: 'Dev' },
      ],
    });
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Experience' }));
    // filled entries start collapsed: no inputs, just their titles
    expect(screen.queryAllByLabelText('Company')).toHaveLength(0);
    screen.getAllByRole('button', { name: 'Drag to reorder' })[0].focus();
    await user.keyboard('{ArrowDown}');
    const titles = () =>
      screen
        .getAllByRole('button', { name: /— Dev$/ })
        .map(button => button.textContent);
    expect(titles()).toEqual(['B — Dev', 'A — Dev']);
    await user.click(screen.getByRole('button', { name: 'B — Dev' }));
    await user.type(screen.getByLabelText('Company'), '!');
    expect(titles()).toEqual(['B! — Dev', 'A — Dev']);
  });

  it('opens a newly added experience for editing', async () => {
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Experience' }));
    await user.click(screen.getByRole('button', { name: 'Add experience' }));
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
  });
});
