import { downloadResume } from '@/pages/resume/download';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ADITYA_RESUME } from '@/lib/aditya';

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

  it('gives a tool a link back to all tools instead of the site navigation, and a copyright-only footer', async () => {
    window.history.pushState({}, '', '/tools/resume');
    render(<App />);
    expect(
      await screen.findByRole('link', { name: 'All tools' })
    ).toHaveAttribute('href', '/tools');
    expect(
      screen.queryByRole('link', { name: 'Experience' })
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Copyright ©/)).toBeInTheDocument();
    expect(screen.queryByText('Navigate')).not.toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: "Fill with Aditya's data" })
    ).toBeInTheDocument();
  });

  it('serves the cover letter tool at /cover-letter', async () => {
    window.history.pushState({}, '', '/tools/cover-letter');
    render(<App />);
    expect(
      await screen.findByRole('link', { name: 'All tools' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Cover Letter' })
    ).toBeInTheDocument();
    expect(await screen.findByLabelText('Company')).toBeInTheDocument();
  });

  it('links a tool page to every other tool from the header, not to itself', async () => {
    window.history.pushState({}, '', '/tools/keyword-check');
    render(<App />);
    const header = screen.getByRole('banner');
    expect(
      within(header).getByRole('link', { name: 'Resume Builder' })
    ).toHaveAttribute('href', '/tools/resume');
    expect(
      within(header).getByRole('link', { name: 'Cover Letter' })
    ).toHaveAttribute('href', '/tools/cover-letter');
    expect(
      within(header).queryByRole('link', { name: 'Keyword Checker' })
    ).not.toBeInTheDocument();
  });

  it('lists every tool at /tools, in job hunt order', async () => {
    window.history.pushState({}, '', '/tools');
    render(<App />);
    expect(
      screen.getByRole('heading', { name: 'Free Tools' })
    ).toBeInTheDocument();
    const items = within(await screen.findByRole('list')).getAllByRole('link');
    expect(items.map(link => link.getAttribute('href'))).toEqual([
      '/tools/resume',
      '/tools/keyword-check',
      '/tools/cover-letter',
    ]);
  });

  it('links the footer to /tools', () => {
    render(<App />);
    expect(
      within(screen.getByRole('contentinfo')).getByRole('link', {
        name: /Free tools/,
      })
    ).toHaveAttribute('href', '/tools');
  });

  it('links the portfolio header to the tools hub, not to each tool', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    expect(
      within(header).getByRole('link', { name: 'Free Tools' })
    ).toHaveAttribute('href', '/tools');
    expect(
      within(header).queryByRole('link', { name: 'Resume Builder' })
    ).not.toBeInTheDocument();
  });

  describe('header logo on a tool page', () => {
    const setReferrer = (value: string) =>
      Object.defineProperty(document, 'referrer', {
        value,
        configurable: true,
      });
    afterEach(() => {
      setReferrer('');
      vi.restoreAllMocks();
    });

    it('goes back in history when the visitor came from the portfolio', () => {
      setReferrer(`${window.location.origin}/#projects`);
      const back = vi
        .spyOn(window.history, 'back')
        .mockImplementation(() => {});
      window.history.pushState({}, '', '/tools/resume');
      render(<App />);
      const link = within(screen.getByRole('banner')).getByRole('link', {
        name: 'Home',
      });
      expect(fireEvent.click(link)).toBe(false);
      expect(back).toHaveBeenCalled();
    });

    it('follows the link home when a tool was opened directly', () => {
      setReferrer('https://www.linkedin.com/');
      const back = vi
        .spyOn(window.history, 'back')
        .mockImplementation(() => {});
      window.history.pushState({}, '', '/tools/resume');
      render(<App />);
      const link = within(screen.getByRole('banner')).getByRole('link', {
        name: 'Home',
      });
      // let the click through but stop jsdom from attempting the navigation
      link.addEventListener('click', e => e.preventDefault());
      link.click();
      expect(back).not.toHaveBeenCalled();
    });

    it('follows the link home when coming from another tool', () => {
      setReferrer(`${window.location.origin}/tools/resume`);
      const back = vi
        .spyOn(window.history, 'back')
        .mockImplementation(() => {});
      window.history.pushState({}, '', '/tools/cover-letter');
      render(<App />);
      const link = within(screen.getByRole('banner')).getByRole('link', {
        name: 'Home',
      });
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
