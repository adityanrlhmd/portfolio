import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import Hero from '@/sections/hero';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navigation />

      <main>
        <Hero />
      </main>
    </ThemeProvider>
  );
}

export default App;
