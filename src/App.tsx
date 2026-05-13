import AnnouncementBar from '@/components/announcement-bar';
import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

import Experience from '@/sections/experience';
import Hero from '@/sections/hero';
import Projects from '@/sections/projects';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AnnouncementBar />
        <Navigation />

        <main className="flex flex-col pb-14 md:pb-0">
          <Hero />
          <Experience />
          <Projects />
        </main>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
