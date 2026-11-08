import { RiArrowRightLine } from '@remixicon/react';

import { useLang } from '@/components/language-provider';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { TOOLS } from '@/lib/config';
import { translations } from '@/lib/i18n';

const T = translations(
  {
    title: 'Free tools for your job search',
    intro:
      'Make your resume, check it against the job, write the cover letter, then see what the offer pays after tax. Free, no sign-up, and nothing you type leaves your browser.',
    madeBy: ['Made by ', ', a frontend engineer.'],
  },
  {
    title: 'Tools gratis buat cari kerja',
    intro:
      'Bikin CV, cocokin sama lowongannya, tulis surat lamaran, terus cek berapa gaji bersih dari tawarannya setelah pajak. Gratis, nggak perlu daftar, dan semua yang kamu ketik nggak keluar dari browser.',
    madeBy: ['Dibikin sama ', ', frontend engineer.'],
  }
);

// The page to share: every tool, numbered in the order a job hunt uses them
const ToolsPage = () => {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <main className="min-h-svh">
      <div className="container max-w-3xl space-y-8 py-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-muted-foreground text-sm">{t.intro}</p>
        </div>

        <ol className="grid gap-4">
          {TOOLS.map((tool, i) => (
            <li key={tool.href}>
              <a href={tool.href} className="group block">
                <Card className="group-hover:ring-primary transition-shadow">
                  <CardHeader className="grid-cols-[auto_1fr_auto] items-center gap-x-4">
                    <tool.icon className="text-primary row-span-2 size-6" />
                    <CardTitle className="text-base">
                      <span className="text-muted-foreground">{i + 1}.</span>{' '}
                      {tool.title[lang]}
                    </CardTitle>
                    <RiArrowRightLine className="text-muted-foreground group-hover:text-primary row-span-2 size-5 transition-colors" />
                    <CardDescription className="col-start-2">
                      {tool.description[lang]}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            </li>
          ))}
        </ol>

        <p className="text-muted-foreground text-xs">
          {t.madeBy[0]}
          <a
            href="/"
            className="hover:text-primary underline underline-offset-4"
          >
            Aditya Hamda
          </a>
          {t.madeBy[1]}
        </p>
      </div>
    </main>
  );
};

export default ToolsPage;
