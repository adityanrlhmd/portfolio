import { Suspense, lazy, useEffect } from 'react';

import { AnnouncementBar } from '@/components/announcement-bar';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { LanguageProvider } from '@/components/language-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { ToolLayout } from '@/components/tool-layout';
import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { TooltipProvider } from '@/components/ui/tooltip';

import Hero from '@/sections/hero';

import { TOOLS, TOOLS_HUB } from '@/lib/config';

// Their own chunks, so the PDF library never loads on the home page
const ResumePage = lazy(() => import('@/pages/resume/resume-page'));
const CoverLetterPage = lazy(
  () => import('@/pages/cover-letter/cover-letter-page')
);
const KeywordCheckPage = lazy(
  () => import('@/pages/keyword-check/keyword-check-page')
);
const SalaryPage = lazy(() => import('@/pages/salary/salary-page'));
const ToolsPage = lazy(() => import('@/pages/tools/tools-page'));
const TOOL_PAGES: Record<
  (typeof TOOLS)[number]['href'] | typeof TOOLS_HUB.href,
  React.ReactNode
> = {
  '/tools': <ToolsPage />,
  '/tools/resume': <ResumePage />,
  '/tools/cover-letter': <CoverLetterPage />,
  '/tools/keyword-check': <KeywordCheckPage />,
  '/tools/salary': <SalaryPage />,
};

// Below the fold, so their code (the contact form's zod/emailjs, motion) stays out of the first load
const Experience = lazy(() => import('@/sections/experience'));
const Projects = lazy(() => import('@/sections/projects'));
const Contact = lazy(() => import('@/sections/contact'));

// The browser jumps to #hash before lazy sections exist, so redo it once they mount
const ScrollToHash = () => {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView();
  }, []);
  return null;
};

function App() {
  const path = window.location.pathname.replace(/\/$/, '');
  // the hub gets the same frame as a tool page
  const tool =
    path === TOOLS_HUB.href ? TOOLS_HUB : TOOLS.find(t => t.href === path);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider>
        <TooltipProvider>
          {/* first, so toasts fired from a page's mount effects aren't dropped */}
          <Toaster />
          {!tool && import.meta.env.VITE_SHOW_ANNOUNCEMENT_BAR === 'true' && (
            <AnnouncementBar />
          )}
          <Header tool={tool?.title} />

          {tool ? (
            <>
              <Suspense
                fallback={
                  tool.href === TOOLS_HUB.href ? (
                    // same height as the hub's <main>, so the footer doesn't jump while loading
                    <div className="flex min-h-svh items-center justify-center">
                      <Spinner className="size-6" />
                    </div>
                  ) : (
                    // the same frame as the page, so the sidebar stays put while it loads
                    <ToolLayout
                      actions={null}
                      form={
                        // spans the empty preview column too (both columns + the 1.5rem gap),
                        // so it sits in the middle of the content beside the sidebar
                        <div className="flex h-[calc(100svh-var(--header-height)-3rem)] items-center justify-center lg:w-[calc(200%+1.5rem)]">
                          <Spinner className="size-6" />
                        </div>
                      }
                      preview={null}
                    />
                  )
                }
              >
                {TOOL_PAGES[tool.href]}
              </Suspense>
              <Footer minimal />
            </>
          ) : (
            <>
              <main className="flex flex-col">
                <Hero />
                {/* min-h-svh keeps the footer from jumping up while the chunk loads */}
                <Suspense fallback={<div className="min-h-svh" />}>
                  <Experience />
                  <Projects />
                  <Contact />
                  <ScrollToHash />
                </Suspense>
              </main>

              <Footer />
            </>
          )}
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
