export const LANGS = ['en', 'id'] as const;
export type Lang = (typeof LANGS)[number];

// for Intl: dates and month names
export const LOCALES: Record<Lang, string> = { en: 'en-US', id: 'id-ID' };

// A file's own strings in both languages. `id` is typed by `en`, so a missing or
// misspelled Indonesian key fails the typecheck instead of showing up blank.
export const translations = <T>(en: T, id: NoInfer<T>) => ({ en, id });

// null when nothing valid is saved or storage is blocked
export const loadLang = (key: string): Lang | null => {
  try {
    const value = localStorage.getItem(key);
    return LANGS.find(lang => lang === value) ?? null;
  } catch {
    return null;
  }
};

export const saveLang = (key: string, lang: Lang) => {
  try {
    localStorage.setItem(key, lang);
  } catch {
    // still switches, just isn't remembered
  }
};

// strings more than one tool uses
export const COMMON = translations(
  {
    localOnly: 'Everything stays in your browser. Nothing is uploaded.',
    fillAditya: "Fill with Aditya's data",
    importPdf: 'Import PDF',
    reset: 'Reset',
    downloadPdf: 'Download PDF',
    clearAll: "Clear everything? This can't be undone.",
    pdfFailed: "Couldn't create the PDF. Please try again.",
  },
  {
    localOnly: 'Semua data tetap di browser kamu, nggak ada yang di-upload.',
    fillAditya: 'Isi pakai data Aditya',
    importPdf: 'Import PDF',
    reset: 'Reset',
    downloadPdf: 'Download PDF',
    clearAll: 'Hapus semua? Ini nggak bisa dibalikin.',
    pdfFailed: 'Gagal bikin PDF. Coba lagi ya.',
  }
);
