import AnnouncementBar from '@/components/announcement-bar';
import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import Experience from '@/sections/experience';
import Hero from '@/sections/hero';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AnnouncementBar />
      <Navigation />

      <main className="flex flex-col pb-14 md:pb-0">
        <Hero />
        <Experience />
      </main>
    </ThemeProvider>
  );
}

export default App;
