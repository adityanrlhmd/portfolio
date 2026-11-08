import {
  RiDownloadLine,
  RiFileUploadLine,
  RiRefreshLine,
  RiUserLine,
} from '@remixicon/react';
import { type FieldPath, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useMemo } from 'react';

import { useT } from '@/components/language-provider';
import { PdfLangToggle } from '@/components/pdf-lang-toggle';
import { PdfPreview } from '@/components/pdf-preview';
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
  decodeCoverLetterFromPdf,
  loadCoverLetter,
  newCoverLetter,
  saveCoverLetter,
  today,
} from '@/lib/cover-letter';
import { downloadPdf } from '@/lib/download-pdf';
import { COMMON, type Lang, translations } from '@/lib/i18n';
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
  }
);

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
      preview={<PdfPreview {...docs} label={t.preview} />}
    />
  );
};

export default CoverLetterPage;
