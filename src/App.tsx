import { Suspense, lazy, useEffect } from 'react';

import { AnnouncementBar } from '@/components/announcement-bar';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { TooltipProvider } from '@/components/ui/tooltip';

import Hero from '@/sections/hero';

import { TOOLS } from '@/lib/config';

// Their own chunks, so the PDF library never loads on the home page
const ResumePage = lazy(() => import('@/pages/resume/resume-page'));
const CoverLetterPage = lazy(
  () => import('@/pages/cover-letter/cover-letter-page')
);
const TOOL_PAGES: Record<(typeof TOOLS)[number]['href'], React.ReactNode> = {
  '/resume': <ResumePage />,
  '/cover-letter': <CoverLetterPage />,
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
  const tool = TOOLS.find(t => t.href === path);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
                // same height as a tool page's <main>, so the footer doesn't jump while loading
                <div className="flex min-h-svh items-center justify-center">
                  <Spinner className="size-6" />
                </div>
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
    </ThemeProvider>
  );
}

export default App;
