import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="min-h-screen">
        <Navigation />
      </main>
    </ThemeProvider>
  );
}

export default App;
