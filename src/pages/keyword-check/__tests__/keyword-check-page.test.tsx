import { fireEvent, render, screen, within } from '@testing-library/react';

import { ADITYA_RESUME } from '@/lib/aditya';
import { saveResume } from '@/lib/resume/storage';

import KeywordCheckPage from '../keyword-check-page';

describe('KeywordCheckPage', () => {
  beforeEach(() => localStorage.clear());

  it('fills the resume from the Resume Builder when one is saved', () => {
    saveResume(ADITYA_RESUME);
    render(<KeywordCheckPage />);
    expect(
      screen.getByLabelText<HTMLTextAreaElement>('Your resume').value
    ).toContain('TypeScript');
  });

  it('lists the job post skills the resume is missing', async () => {
    render(<KeywordCheckPage />);
    fireEvent.change(screen.getByLabelText('Your resume'), {
      target: { value: 'Shipped React apps' },
    });
    fireEvent.change(screen.getByLabelText('Job post'), {
      target: { value: 'React, Docker and more Docker' },
    });

    const missing = (
      await screen.findByRole('heading', { name: /Missing from your resume/ })
    ).parentElement!;
    expect(within(missing).getByText('Docker')).toBeInTheDocument();
    expect(within(missing).getByText('×2')).toBeInTheDocument();
    const matched = screen.getByRole('heading', {
      name: /Already in your resume/,
    }).parentElement!;
    expect(within(matched).getByText('React')).toBeInTheDocument();
  });
});
