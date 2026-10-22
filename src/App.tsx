import { Suspense, lazy } from 'react';

import { AnnouncementBar } from '@/components/announcement-bar';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { TooltipProvider } from '@/components/ui/tooltip';

import Contact from '@/sections/contact';
import Experience from '@/sections/experience';
import Hero from '@/sections/hero';
import Projects from '@/sections/projects';

// Its own chunk, so the PDF library never loads on the home page
const ResumePage = lazy(() => import('@/pages/resume/resume-page'));

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
              <Experience />
              <Projects />
              <Contact />
            </main>

            <Footer />
          </>
        )}
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
