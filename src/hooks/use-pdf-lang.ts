import { useState } from 'react';

import { type Lang, loadLang, saveLang } from '@/lib/i18n';

const STORAGE_KEY = 'pdf-lang';

// The language of the made PDFs, apart from the site's: a visitor may read the site in
// Indonesian and still apply in English. Shared by the resume and the cover letter, so
// the two stay a set. English until picked.
export const usePdfLang = () => {
  const [lang, setLang] = useState<Lang>(() => loadLang(STORAGE_KEY) ?? 'en');
  const change = (next: Lang) => {
    saveLang(STORAGE_KEY, next);
    setLang(next);
  };
  return [lang, change] as const;
};
