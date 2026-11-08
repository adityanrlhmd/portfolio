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

  it('gives a tool the tools nav instead of the site navigation, and a copyright-only footer', async () => {
    window.history.pushState({}, '', '/tools/resume');
    render(<App />);
    // the loading frame already has the nav, so wait for the page itself; its chunk
    // pulls in the PDF library and can take over a second under a full test run
    expect(
      await screen.findByRole(
        'button',
        { name: "Fill with Aditya's data" },
        { timeout: 5000 }
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Tools' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Experience' })
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Copyright ©/)).toBeInTheDocument();
    expect(screen.queryByText('Navigate')).not.toBeInTheDocument();
  });

  it('serves the cover letter tool at /cover-letter', async () => {
    window.history.pushState({}, '', '/tools/cover-letter');
    render(<App />);
    expect(
      await screen.findByRole('navigation', { name: 'Tools' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Cover Letter' })
    ).toBeInTheDocument();
    // the page's own chunk, not the loading frame
    expect(
      await screen.findByLabelText('Company', {}, { timeout: 5000 })
    ).toBeInTheDocument();
  });

  it('lists every tool in the tools nav, marks the open one, and opens it from the header menu', async () => {
    window.history.pushState({}, '', '/tools/keyword-check');
    render(<App />);
    const nav = await screen.findByRole('navigation', { name: 'Tools' });
    expect(within(nav).getByRole('link', { name: 'Tools' })).toHaveAttribute(
      'href',
      '/tools'
    );
    expect(
      within(nav).getByRole('link', { name: 'Resume Builder' })
    ).toHaveAttribute('href', '/tools/resume');
    expect(
      within(nav).getByRole('link', { name: 'Keyword Checker' })
    ).toHaveAttribute('aria-current', 'page');

    await userEvent.click(
      within(screen.getByRole('banner')).getByRole('button', {
        name: 'Tools menu',
      })
    );
    const sheet = await screen.findByRole('dialog');
    expect(
      within(sheet).getByRole('link', { name: 'Salary Calculator' })
    ).toHaveAttribute('href', '/tools/salary');
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
      '/tools/salary',
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

  it('switches the site to Indonesian and remembers it', async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Ganti ke Bahasa Indonesia' })
    );
    const header = screen.getByRole('banner');
    expect(
      within(header).getByRole('link', { name: 'Pengalaman' })
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('id');
    expect(localStorage.getItem('lang')).toBe('id');

    await userEvent.click(
      screen.getByRole('button', { name: 'Switch to English' })
    );
    expect(
      within(header).getByRole('link', { name: 'Experience' })
    ).toBeInTheDocument();
  });

  it("downloads Aditya's CV from the hero", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'My Resume' }));
    await waitFor(() =>
      expect(downloadResume).toHaveBeenCalledWith(ADITYA_RESUME)
    );
  });
});
