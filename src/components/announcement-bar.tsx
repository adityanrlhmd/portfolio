import { useT } from '@/components/language-provider';

import { translations } from '@/lib/i18n';

const T = translations(
  {
    news: 'New: free job search tools, from resume to cover letter.',
    cta: 'See the tools →',
  },
  {
    news: 'Baru: tools gratis buat cari kerja, dari CV sampai surat lamaran.',
    cta: 'Lihat tools-nya →',
  }
);

export const AnnouncementBar = () => {
  const t = useT(T);

  return (
    <div
      data-slot="announcement-bar"
      className="bg-primary text-primary-foreground"
    >
      <div className="container py-2 text-center text-xs">
        <p>
          {t.news}{' '}
          <a href="/tools" className="font-bold hover:underline">
            {t.cta}
          </a>
        </p>
      </div>
    </div>
  );
};
