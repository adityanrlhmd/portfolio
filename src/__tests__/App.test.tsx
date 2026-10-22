import { downloadResume } from '@/pages/resume/download';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ADITYA_RESUME } from '@/lib/resume/aditya';

import App from '../App';

vi.mock('@/pages/resume/download', () => ({
  downloadResume: vi.fn(async () => {}),
}));

describe('App', () => {
  afterEach(() => window.history.pushState({}, '', '/'));

  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('gives /resume a back link instead of the site navigation, and a copyright-only footer', async () => {
    window.history.pushState({}, '', '/resume');
    render(<App />);
    expect(
      await screen.findByRole('link', { name: 'Back to portfolio' })
    ).toHaveAttribute('href', '/');
    expect(
      screen.queryByRole('link', { name: 'Experience' })
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Copyright ©/)).toBeInTheDocument();
    expect(screen.queryByText('Navigate')).not.toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: "Fill with Aditya's data" })
    ).toBeInTheDocument();
  });

  it('links to the resume builder from a header icon, not the section nav', () => {
    render(<App />);
    expect(
      within(screen.getByRole('banner')).getByRole('link', {
        name: 'Resume Builder',
      })
    ).toHaveAttribute('href', '/resume');
    expect(
      screen.queryByRole('link', { name: 'Resume' })
    ).not.toBeInTheDocument();
  });

  it('lists the resume builder as a free tool in the footer', () => {
    render(<App />);
    expect(
      within(screen.getByRole('contentinfo')).getByRole('link', {
        name: 'Resume Builder',
      })
    ).toHaveAttribute('href', '/resume');
  });

  describe('back to portfolio', () => {
    const setReferrer = (value: string) =>
      Object.defineProperty(document, 'referrer', {
        value,
        configurable: true,
      });
    afterEach(() => {
      setReferrer('');
      vi.restoreAllMocks();
    });

    it('goes back in history when the visitor came from this site', async () => {
      setReferrer(`${window.location.origin}/#projects`);
      const back = vi
        .spyOn(window.history, 'back')
        .mockImplementation(() => {});
      window.history.pushState({}, '', '/resume');
      render(<App />);
      const link = await screen.findByRole('link', {
        name: 'Back to portfolio',
      });
      expect(fireEvent.click(link)).toBe(false);
      expect(back).toHaveBeenCalled();
    });

    it('follows the link home when /resume was opened directly', async () => {
      setReferrer('https://www.linkedin.com/');
      const back = vi
        .spyOn(window.history, 'back')
        .mockImplementation(() => {});
      window.history.pushState({}, '', '/resume');
      render(<App />);
      const link = await screen.findByRole('link', {
        name: 'Back to portfolio',
      });
      // let the click through but stop jsdom from attempting the navigation
      link.addEventListener('click', e => e.preventDefault());
      link.click();
      expect(back).not.toHaveBeenCalled();
    });
  });

  it("downloads Aditya's CV from the hero", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'My Resume' }));
    await waitFor(() =>
      expect(downloadResume).toHaveBeenCalledWith(ADITYA_RESUME)
    );
  });
});
