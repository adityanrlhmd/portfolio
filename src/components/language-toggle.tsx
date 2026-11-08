import { useLang } from '@/components/language-provider';
import { Button } from '@/components/ui/button';

// Shows the current language and switches to the other one, like the theme toggle beside it.
export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
      // in the language it switches to, so whoever needs it can read it
      aria-label={
        lang === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'
      }
      className="text-xs font-semibold"
    >
      {lang.toUpperCase()}
    </Button>
  );
}
