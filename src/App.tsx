import { Suspense, lazy, useEffect } from 'react';

import { AnnouncementBar } from '@/components/announcement-bar';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { TooltipProvider } from '@/components/ui/tooltip';

import Hero from '@/sections/hero';

// Its own chunk, so the PDF library never loads on the home page
const ResumePage = lazy(() => import('@/pages/resume/resume-page'));

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
  const isResume = window.location.pathname.replace(/\/$/, '') === '/resume';

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        {/* first, so toasts fired from a page's mount effects aren't dropped */}
        <Toaster />
        {!isResume && import.meta.env.VITE_SHOW_ANNOUNCEMENT_BAR === 'true' && (
          <AnnouncementBar />
        )}
        <Header resume={isResume} />

        {isResume ? (
          <>
            <Suspense
              fallback={
                // same height as the resume page's <main>, so the footer doesn't jump while loading
                <div className="flex min-h-svh items-center justify-center">
                  <Spinner className="size-6" />
                </div>
              }
            >
              <ResumePage />
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
