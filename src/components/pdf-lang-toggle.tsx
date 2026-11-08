import { useLang } from '@/components/language-provider';
import { Toggle } from '@/components/toggle';

import type { Lang } from '@/lib/i18n';

// the PDFs' language, apart from the site's; see usePdfLang
export const PdfLangToggle = ({
  value,
  onChange,
}: {
  value: Lang;
  onChange: (lang: Lang) => void;
}) => {
  const { lang } = useLang();

  return (
    <div className="flex items-center gap-1">
      <span aria-hidden className="text-muted-foreground pl-1 text-xs">
        PDF
      </span>
      <Toggle
        label={lang === 'id' ? 'Bahasa PDF' : 'PDF language'}
        value={value}
        options={{ en: 'EN', id: 'ID' }}
        onChange={onChange}
      />
    </div>
  );
};
