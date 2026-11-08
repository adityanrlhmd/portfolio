import { createContext, useContext, useLayoutEffect, useState } from 'react';

import { type Lang, loadLang, saveLang } from '@/lib/i18n';

const STORAGE_KEY = 'lang';

type LanguageState = { lang: Lang; setLang: (lang: Lang) => void };

// English without a provider, so a page rendered on its own (in tests) still works
const LanguageContext = createContext<LanguageState>({
  lang: 'en',
  setLang: () => {},
});

// first visit follows the browser: Indonesian for an Indonesian browser, English otherwise
const initialLang = (): Lang =>
  loadLang(STORAGE_KEY) ??
  (navigator.language.toLowerCase().startsWith('id') ? 'id' : 'en');

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState(initialLang);

  // screen readers and the browser's own translate offer go by <html lang>
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    setLang: (next: Lang) => {
      saveLang(STORAGE_KEY, next);
      setLang(next);
    },
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LanguageContext);

// a file's strings, from translations(), in the site's language
// eslint-disable-next-line react-refresh/only-export-components
export const useT = <T,>(dict: Record<Lang, T>) => dict[useLang().lang];
