import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EMPTY_RESUME } from '@/lib/resume/schema';
import { saveResume } from '@/lib/resume/storage';

import ResumePage from '../resume-page';

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
    render(<ResumePage />);
    expect(fullName()).toHaveValue('');
  });

  it("fills Aditya's data on click", async () => {
    render(<ResumePage />);
    await user.click(
      screen.getByRole('button', { name: "Fill with Aditya's data" })
    );
    expect(fullName()).toHaveValue('Aditya Nurul Hamda');
  });

  it('asks before overwriting typed data, keeps it on cancel', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<ResumePage />);
    await user.type(fullName(), 'Budi');
    await user.click(
      screen.getByRole('button', { name: "Fill with Aditya's data" })
    );
    expect(window.confirm).toHaveBeenCalled();
    expect(fullName()).toHaveValue('Budi');
  });

  it('restores saved progress', () => {
    saveResume({ ...EMPTY_RESUME, name: 'Sari' });
    render(<ResumePage />);
    expect(fullName()).toHaveValue('Sari');
  });

  it('rejects a PDF not made here and leaves the form alone', async () => {
    render(<ResumePage />);
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

  it('moves an experience down with the keyboard and keeps edits on the right item', async () => {
    saveResume({
      ...EMPTY_RESUME,
      experiences: [
        { ...blankExperience, company: 'A' },
        { ...blankExperience, company: 'B' },
      ],
    });
    render(<ResumePage />);
    await user.click(screen.getByRole('button', { name: 'Experience' }));
    screen.getAllByRole('button', { name: 'Drag to reorder' })[0].focus();
    await user.keyboard('{ArrowDown}');
    const companies = () =>
      screen
        .getAllByLabelText('Company')
        .map(input => (input as HTMLInputElement).value);
    expect(companies()).toEqual(['B', 'A']);
    await user.type(screen.getAllByLabelText('Company')[0], '!');
    expect(companies()).toEqual(['B!', 'A']);
  });
});
