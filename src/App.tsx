import { AnnouncementBar } from '@/components/announcement-bar';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import Contact from '@/sections/contact';
import Experience from '@/sections/experience';
import Hero from '@/sections/hero';
import Projects from '@/sections/projects';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AnnouncementBar />
        <Header />

        <main className="flex flex-col">
          <Hero />
          <Experience />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
