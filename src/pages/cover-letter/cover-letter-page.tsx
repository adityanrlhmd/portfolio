import {
  RiDownloadLine,
  RiFileCopyLine,
  RiFileUploadLine,
  RiRefreshLine,
  RiUserLine,
} from '@remixicon/react';
import { type FieldPath, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMemo, useState } from 'react';

import { useT } from '@/components/language-provider';
import { PdfLangToggle } from '@/components/pdf-lang-toggle';
import { PdfPreview } from '@/components/pdf-preview';
import { Toggle } from '@/components/toggle';
import { ToolLayout } from '@/components/tool-layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useAutosave } from '@/hooks/use-autosave';
import { usePdfLang } from '@/hooks/use-pdf-lang';

import {
  ADITYA_COVER_LETTER,
  type CoverLetter,
  PLACEHOLDER_COVER_LETTER,
  applicationEmail,
  decodeCoverLetterFromPdf,
  loadCoverLetter,
  newCoverLetter,
  saveCoverLetter,
  signatureLinks,
  today,
} from '@/lib/cover-letter';
import { downloadPdf } from '@/lib/download-pdf';
import { COMMON, type Lang, translations } from '@/lib/i18n';
import { loadStored, saveStored } from '@/lib/storage';
import { cn } from '@/lib/utils';

import { COVER_LETTER_PDF, CoverLetterDocument } from './cover-letter-document';

const T = translations(
  {
    aboutYou: 'About you',
    theJob: 'The job',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    company: 'Company',
    role: 'Position',
    recipient: 'Addressed to',
    recipientHint: (greeting: string) => `Leave empty for "${greeting}".`,
    date: 'Date',
    body: 'Letter',
    bodyHint:
      'Leave a blank line between paragraphs. The greeting and sign-off are added for you.',
    replaceWithAditya: "Replace what you have typed with Aditya's letter?",
    importOnlyOurs:
      'Only cover letters made with this generator can be imported.',
    replaceWithImport:
      'Replace what you have typed with the imported cover letter?',
    imported: 'Cover letter imported.',
    preview: 'Cover letter preview',
    previewOf: 'Show',
    letterTab: 'Cover letter',
    emailTab: 'Email to HR',
    emailSubject: 'Subject',
    emailBody: 'Email body',
    letterIn: 'Cover letter',
    letterAttached: 'Attached',
    letterInline: 'In the email',
    emailHint: (inline: boolean) =>
      `Written in the PDF's language from your form. ${inline ? 'Your whole letter is the email, so attach only your CV.' : "Your letter's first paragraph is the pitch. Attach your CV and this cover letter yourself."} Links come from your saved resume. If the job post asks for a subject format, use that.`,
    copy: (what: string) => `Copy ${what.toLowerCase()}`,
    copyShort: 'Copy',
    copied: 'Copied.',
    copyFailed: "Couldn't copy. Select the text and copy it by hand.",
  },
  {
    aboutYou: 'Tentang kamu',
    theJob: 'Lowongannya',
    fullName: 'Nama lengkap',
    email: 'Email',
    phone: 'Telepon',
    location: 'Lokasi',
    company: 'Perusahaan',
    role: 'Posisi',
    recipient: 'Ditujukan kepada',
    recipientHint: (greeting: string) => `Kosongin aja buat "${greeting}".`,
    date: 'Tanggal',
    body: 'Isi surat',
    bodyHint:
      'Kasih satu baris kosong di antara paragraf. Salam pembuka dan penutup udah otomatis ditambahin.',
    replaceWithAditya: 'Timpa isian kamu pakai surat Aditya?',
    importOnlyOurs:
      'Cuma surat lamaran yang dibikin di generator ini yang bisa di-import.',
    replaceWithImport: 'Timpa isian kamu pakai surat lamaran yang di-import?',
    imported: 'Surat lamaran berhasil di-import.',
    preview: 'Preview surat lamaran',
    previewOf: 'Tampilkan',
    letterTab: 'Surat lamaran',
    emailTab: 'Email ke HR',
    emailSubject: 'Subjek',
    emailBody: 'Isi email',
    letterIn: 'Surat lamaran',
    letterAttached: 'Dilampirin',
    letterInline: 'Di badan email',
    emailHint: (inline: boolean) =>
      `Ditulis pakai bahasa PDF dari isian kamu. ${inline ? 'Seluruh surat lamaran jadi isi email, jadi cukup lampirin CV aja.' : 'Paragraf pertama surat lamaran dipakai buat perkenalan singkat. CV sama surat lamaran ini tetep harus kamu lampirin sendiri ya.'} Link diambil dari resume yang kamu simpan. Kalau lowongannya minta format subjek tertentu, ikutin itu.`,
    copy: (what: string) => `Copy ${what.toLowerCase()}`,
    copyShort: 'Copy',
    copied: 'Udah ke-copy.',
    copyFailed: 'Gagal copy. Blok teksnya terus copy manual aja.',
  }
);

// where the email puts the letter; remembered per browser, inline until picked
const LETTER_IN_KEY = 'cover-letter:letter-in';
const letterInSchema = z.enum(['inline', 'attached']);

const fileName = (letter: CoverLetter, lang: Lang) =>
  [letter.name.trim(), COVER_LETTER_PDF[lang].title, letter.company.trim()]
    .filter(Boolean)
    .join(' - ') + '.pdf';

// Reset clears the sender too, unlike a first visit, which copies it from the saved resume
const blankLetter = (lang: Lang): CoverLetter => ({
  ...newCoverLetter(lang),
  name: '',
  email: '',
  phone: '',
  location: '',
});

// untouched: still what a new or reset letter starts with
const isUntouched = (letter: CoverLetter, lang: Lang) =>
  [newCoverLetter(lang), blankLetter(lang)].some(
    start => JSON.stringify(letter) === JSON.stringify(start)
  );

const CoverLetterPage = () => {
  const t = { ...useT(COMMON), ...useT(T) };
  const [pdfLang, setPdfLang] = usePdfLang();
  const pdf = COVER_LETTER_PDF[pdfLang];
  const form = useForm<CoverLetter>({
    defaultValues: loadCoverLetter() ?? newCoverLetter(pdfLang),
  });
  const debounced = useAutosave(form, saveCoverLetter);
  const [view, setView] = useState<'pdf' | 'email'>('pdf');
  const [letterIn, setLetterIn] = useState(
    () => loadStored(LETTER_IN_KEY, letterInSchema) ?? 'inline'
  );
  const changeLetterIn = (next: typeof letterIn) => {
    saveStored(LETTER_IN_KEY, next);
    setLetterIn(next);
  };

  const fields: {
    title: string;
    fields: { name: FieldPath<CoverLetter>; label: string; hint?: string }[];
  }[] = [
    {
      title: t.aboutYou,
      fields: [
        { name: 'name', label: t.fullName },
        { name: 'email', label: t.email },
        { name: 'phone', label: t.phone },
        { name: 'location', label: t.location },
      ],
    },
    {
      title: t.theJob,
      fields: [
        { name: 'company', label: t.company },
        { name: 'role', label: t.role },
        {
          name: 'recipient',
          label: t.recipient,
          hint: t.recipientHint(pdf.greeting(pdf.recipient)),
        },
        { name: 'date', label: t.date },
      ],
    },
  ];

  // today's date follows the PDF's language; a date the visitor typed stays as it is
  const changePdfLang = (lang: Lang) => {
    if (form.getValues('date') === today(pdfLang))
      form.setValue('date', today(lang), { shouldDirty: true });
    setPdfLang(lang);
  };

  const docs = useMemo(
    () => ({
      preview: (
        <CoverLetterDocument
          letter={debounced}
          placeholder={PLACEHOLDER_COVER_LETTER[pdfLang]}
          lang={pdfLang}
        />
      ),
      document: <CoverLetterDocument letter={debounced} lang={pdfLang} />,
    }),
    [debounced, pdfLang]
  );

  const fillAditya = () => {
    if (
      !isUntouched(form.getValues(), pdfLang) &&
      !window.confirm(t.replaceWithAditya)
    )
      return;
    form.reset({ ...ADITYA_COVER_LETTER, date: form.getValues('date') });
  };

  const importPdf = async (file: File | undefined) => {
    if (!file) return;
    const imported = decodeCoverLetterFromPdf(await file.arrayBuffer());
    if (!imported) {
      toast.error(t.importOnlyOurs);
      return;
    }
    if (
      !isUntouched(form.getValues(), pdfLang) &&
      !window.confirm(t.replaceWithImport)
    )
      return;
    form.reset(imported);
    toast.success(t.imported);
  };

  const reset = () => {
    if (!window.confirm(t.clearAll)) return;
    form.reset(blankLetter(pdfLang));
  };

  const links = useMemo(() => signatureLinks(debounced.name), [debounced.name]);
  const email = applicationEmail(debounced, pdfLang, {
    inline: letterIn === 'inline',
    links,
  });

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error(t.copyFailed);
    }
  };

  const download = async () => {
    const letter = form.getValues();
    try {
      await downloadPdf(
        <CoverLetterDocument letter={letter} lang={pdfLang} />,
        fileName(letter, pdfLang)
      );
    } catch {
      toast.error(t.pdfFailed);
    }
  };

  return (
    <ToolLayout
      actions={
        <>
          <Button type="button" variant="outline" onClick={fillAditya}>
            <RiUserLine /> {t.fillAditya}
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
          <Button type="button" variant="outline" onClick={reset}>
            <RiRefreshLine /> {t.reset}
          </Button>
          <Button type="button" onClick={download}>
            <RiDownloadLine /> {t.downloadPdf}
          </Button>
          <PdfLangToggle value={pdfLang} onChange={changePdfLang} />
        </>
      }
      form={
        <form onSubmit={e => e.preventDefault()} className="space-y-6">
          {fields.map(group => (
            <fieldset key={group.title} className="space-y-4">
              <legend className="mb-4 text-sm font-medium">
                {group.title}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.fields.map(field => (
                  <Field key={field.name}>
                    <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                    <Input id={field.name} {...form.register(field.name)} />
                    {field.hint && (
                      <FieldDescription>{field.hint}</FieldDescription>
                    )}
                  </Field>
                ))}
              </div>
            </fieldset>
          ))}
          <Field>
            <FieldLabel htmlFor="body">{t.body}</FieldLabel>
            <Textarea
              id="body"
              className="min-h-80"
              {...form.register('body')}
            />
            <FieldDescription>{t.bodyHint}</FieldDescription>
          </Field>
        </form>
      }
      preview={
        <div className="flex h-full flex-col gap-3">
          <Toggle
            label={t.previewOf}
            value={view}
            options={{ pdf: t.letterTab, email: t.emailTab }}
            onChange={setView}
          />
          <div className="min-h-0 flex-1">
            {view === 'pdf' ? (
              <PdfPreview {...docs} label={t.preview} />
            ) : (
              <div className="h-full space-y-4 overflow-y-auto rounded-md border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span aria-hidden className="text-muted-foreground text-xs">
                    {t.letterIn}
                  </span>
                  <Toggle
                    label={t.letterIn}
                    value={letterIn}
                    options={{
                      inline: t.letterInline,
                      attached: t.letterAttached,
                    }}
                    onChange={changeLetterIn}
                  />
                </div>
                {(
                  [
                    [t.emailSubject, email.subject, 'font-medium'],
                    [t.emailBody, email.body, 'whitespace-pre-wrap'],
                  ] as const
                ).map(([label, value, style]) => (
                  <section key={label} aria-label={label} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-muted-foreground text-xs">{label}</h2>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={t.copy(label)}
                        onClick={() => copy(value)}
                      >
                        <RiFileCopyLine /> {t.copyShort}
                      </Button>
                    </div>
                    <p className={cn('text-sm', style)}>{value}</p>
                  </section>
                ))}
                <p className="text-muted-foreground border-t pt-4 text-xs">
                  {t.emailHint(letterIn === 'inline')}
                </p>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};

export default CoverLetterPage;
