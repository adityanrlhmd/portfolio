import AnnouncementBar from '@/components/announcement-bar';
import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import Hero from '@/sections/hero';

import { GridBeam } from './components/grid-beam';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AnnouncementBar />
      <Navigation />

      <GridBeam>
        <main className="flex flex-col">
          <Hero />
        </main>
      </GridBeam>
    </ThemeProvider>
  );
}

export default App;
