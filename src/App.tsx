import AnnouncementBar from '@/components/announcement-bar';
import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import Hero from '@/sections/hero';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AnnouncementBar />
      <Navigation />

      <main>
        <Hero />
      </main>
    </ThemeProvider>
  );
}

export default App;
