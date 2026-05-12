import AnnouncementBar from '@/components/announcement-bar';
import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';

import Experience from '@/sections/experience';
import Hero from '@/sections/hero';

import Projects from './sections/projects';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AnnouncementBar />
      <Navigation />

      <main className="flex flex-col pb-14 md:pb-0">
        <Hero />
        <Experience />
        <Projects />
      </main>
    </ThemeProvider>
  );
}

export default App;
