import { RiFileUploadLine, RiFileUserLine } from '@remixicon/react';
import { toast } from 'sonner';

import { useDeferredValue, useMemo, useState } from 'react';

import { useLang } from '@/components/language-provider';
import { ToolLayout } from '@/components/tool-layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

import { TOOLS } from '@/lib/config';
import { translations } from '@/lib/i18n';
import { type SkillHit, compareSkills } from '@/lib/keywords';
import { resumeText } from '@/lib/resume/format';
import { loadResume } from '@/lib/resume/storage';
import { cn } from '@/lib/utils';

const T = translations(
  {
    tabs: ['Job & resume', 'Results'] as [string, string],
    useSaved: 'Use saved resume',
    importPdf: 'Import resume PDF',
    job: 'Job post',
    jobHint: 'Paste the whole job description, English or Indonesian.',
    resume: 'Your resume',
    // around the link to the Resume Builder
    resumeHint: [
      'Filled from the ',
      ' when you have one saved. Edit it there, then press Use saved resume. You can also import any text PDF, or paste.',
    ],
    replace: 'Replace the resume text you have now?',
    noSaved: 'No saved resume yet. Make one in the Resume Builder.',
    noText:
      'No text found in this PDF. If it is a scan, paste the text instead.',
    unreadable: "Couldn't read this PDF.",
    results: 'Results',
    example:
      'Example for a frontend job. Paste a job post to check your resume against it.',
    noneFound: 'No skills from the list were found in this job post.',
    missing: 'Missing from your resume',
    matched: 'Already in your resume',
    none: 'None.',
    scope:
      "Checks for common skills and tools in tech, office software, design, marketing, finance, HR and soft skills, in English or Indonesian. A skill outside those won't show up. Most mentioned in the job post first.",
  },
  {
    tabs: ['Lowongan & CV', 'Hasil'],
    useSaved: 'Pakai CV tersimpan',
    importPdf: 'Import PDF CV',
    job: 'Lowongan kerja',
    jobHint:
      'Paste seluruh deskripsi lowongannya, bahasa Inggris atau Indonesia.',
    resume: 'CV kamu',
    resumeHint: [
      'Diisi dari ',
      ' kalau kamu udah nyimpen CV di sana. Edit di sana, terus klik Pakai CV tersimpan. Bisa juga import PDF yang berisi teks, atau paste langsung.',
    ],
    replace: 'Timpa teks CV yang sekarang?',
    noSaved: 'Belum ada CV yang tersimpan. Bikin dulu di Pembuat CV.',
    noText: 'Nggak ada teks di PDF ini. Kalau hasil scan, paste teksnya aja.',
    unreadable: 'PDF ini nggak bisa dibaca.',
    results: 'Hasil',
    example:
      'Contoh buat lowongan frontend. Paste lowongan kerja buat dicocokin sama CV kamu.',
    noneFound: 'Nggak ada skill dari daftar yang ketemu di lowongan ini.',
    missing: 'Belum ada di CV kamu',
    matched: 'Sudah ada di CV kamu',
    none: 'Nggak ada.',
    scope:
      'Ngecek skill dan tools yang umum di bidang teknologi, software kantor, desain, marketing, keuangan, HR, dan soft skill, dalam bahasa Inggris atau Indonesia. Skill di luar itu nggak bakal muncul. Yang paling sering disebut di lowongan tampil duluan.',
  }
);

const RESUME_BUILDER = TOOLS.find(tool => tool.href === '/tools/resume')!;

const SkillList = ({
  title,
  skills,
  missing,
  none,
}: {
  title: string;
  skills: SkillHit[];
  missing?: boolean;
  none: string;
}) => (
  <section className="space-y-2">
    <h2 className="text-sm font-medium">
      {title} ({skills.length})
    </h2>
    {skills.length ? (
      <ul className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <li
            key={skill.name}
            className={cn(
              'rounded-md border px-2 py-1 text-xs',
              missing && 'border-destructive/50 text-destructive'
            )}
          >
            {skill.name}
            {skill.count > 1 && (
              <span className="text-muted-foreground"> ×{skill.count}</span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-muted-foreground text-xs">{none}</p>
    )}
  </section>
);

// shown faded until a job post is pasted, so the empty preview shows what to expect
const EXAMPLE = compareSkills(
  'Built React apps in TypeScript with Tailwind CSS',
  'Frontend Engineer. React and TypeScript, Next.js a plus. You will work with React every day, write tests with Jest, ship with Docker and CI/CD, and need good communication in English.'
);

const KeywordCheckPage = () => {
  const { lang } = useLang();
  const t = T[lang];
  const [resume, setResume] = useState(() => {
    const saved = loadResume();
    return saved ? resumeText(saved) : '';
  });
  const [job, setJob] = useState('');

  const deferredResume = useDeferredValue(resume);
  const deferredJob = useDeferredValue(job);
  const result = useMemo(
    () => compareSkills(deferredResume, deferredJob),
    [deferredResume, deferredJob]
  );

  const replaceResume = (text: string) => {
    if (resume.trim() && resume !== text && !window.confirm(t.replace)) return;
    setResume(text);
  };

  const fillFromSaved = () => {
    const saved = loadResume();
    if (!saved) {
      toast.error(t.noSaved);
      return;
    }
    replaceResume(resumeText(saved));
  };

  const importPdf = async (file: File | undefined) => {
    if (!file) return;
    try {
      // loaded on demand, so the page itself stays light
      const { pdfText } = await import('@/lib/pdf-text');
      const text = await pdfText(await file.arrayBuffer());
      if (!text) {
        toast.error(t.noText);
        return;
      }
      replaceResume(text);
    } catch {
      toast.error(t.unreadable);
    }
  };

  const total = result.missing.length + result.matched.length;

  return (
    <ToolLayout
      tabs={t.tabs}
      actions={
        <>
          <Button type="button" variant="outline" onClick={fillFromSaved}>
            <RiFileUserLine /> {t.useSaved}
          </Button>
          <label
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'focus-within:ring-ring/30 cursor-pointer focus-within:ring-2'
            )}
          >
            <RiFileUploadLine />
            {t.importPdf}
            <input
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={e => {
                importPdf(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
        </>
      }
      form={
        <form onSubmit={e => e.preventDefault()} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="job">{t.job}</FieldLabel>
            <Textarea
              id="job"
              className="min-h-60"
              value={job}
              onChange={e => setJob(e.target.value)}
            />
            <FieldDescription>{t.jobHint}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="resume">{t.resume}</FieldLabel>
            <Textarea
              id="resume"
              className="min-h-60"
              value={resume}
              onChange={e => setResume(e.target.value)}
            />
            <FieldDescription>
              {t.resumeHint[0]}
              {/* a new tab, since the job post pasted here isn't saved */}
              <a
                href="/tools/resume"
                target="_blank"
                className="hover:text-primary underline underline-offset-4"
              >
                {RESUME_BUILDER.title[lang]}
              </a>
              {t.resumeHint[1]}
            </FieldDescription>
          </Field>
        </form>
      }
      preview={
        // hugs the results instead of filling the PDF-sized slot, scrolls if they outgrow it
        <div className="flex max-h-full flex-col gap-2">
          <div
            role="region"
            aria-label={t.results}
            className="min-h-0 space-y-6 overflow-y-auto rounded-md border p-4"
          >
            {!job.trim() && (
              <p className="text-muted-foreground text-sm">{t.example}</p>
            )}
            {job.trim() && total === 0 ? (
              <p className="text-muted-foreground text-sm">{t.noneFound}</p>
            ) : (
              <div className={cn('space-y-6', !job.trim() && 'opacity-50')}>
                <SkillList
                  title={t.missing}
                  skills={(job.trim() ? result : EXAMPLE).missing}
                  missing
                  none={t.none}
                />
                <SkillList
                  title={t.matched}
                  skills={(job.trim() ? result : EXAMPLE).matched}
                  none={t.none}
                />
              </div>
            )}
          </div>
          <FieldDescription>{t.scope}</FieldDescription>
        </div>
      }
    />
  );
};

export default KeywordCheckPage;
