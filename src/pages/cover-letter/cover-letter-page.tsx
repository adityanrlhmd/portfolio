import {
  RiDownloadLine,
  RiFileUploadLine,
  RiRefreshLine,
  RiUserLine,
} from '@remixicon/react';
import { type FieldPath, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useMemo } from 'react';

import { PdfPreview } from '@/components/pdf-preview';
import { ToolLayout } from '@/components/tool-layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useAutosave } from '@/hooks/use-autosave';

import {
  ADITYA_COVER_LETTER,
  type CoverLetter,
  PLACEHOLDER_COVER_LETTER,
  decodeCoverLetterFromPdf,
  loadCoverLetter,
  newCoverLetter,
  saveCoverLetter,
} from '@/lib/cover-letter';
import { downloadPdf } from '@/lib/download-pdf';
import { cn } from '@/lib/utils';

import { CoverLetterDocument } from './cover-letter-document';

const FIELDS: {
  title: string;
  fields: { name: FieldPath<CoverLetter>; label: string; hint?: string }[];
}[] = [
  {
    title: 'About you',
    fields: [
      { name: 'name', label: 'Full name' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'location', label: 'Location' },
    ],
  },
  {
    title: 'The job',
    fields: [
      { name: 'company', label: 'Company' },
      { name: 'role', label: 'Position' },
      {
        name: 'recipient',
        label: 'Addressed to',
        hint: 'Leave empty for "Dear Hiring Manager".',
      },
      { name: 'date', label: 'Date' },
    ],
  },
];

const fileName = (letter: CoverLetter) =>
  [letter.name.trim(), 'Cover Letter', letter.company.trim()]
    .filter(Boolean)
    .join(' - ') + '.pdf';

// untouched: still what a new letter starts with
const isUntouched = (letter: CoverLetter) =>
  JSON.stringify(letter) === JSON.stringify(newCoverLetter());

const CoverLetterPage = () => {
  const form = useForm<CoverLetter>({
    defaultValues: loadCoverLetter() ?? newCoverLetter(),
  });
  const debounced = useAutosave(form, saveCoverLetter);

  const docs = useMemo(
    () => ({
      preview: (
        <CoverLetterDocument
          letter={debounced}
          placeholder={PLACEHOLDER_COVER_LETTER}
        />
      ),
      document: <CoverLetterDocument letter={debounced} />,
    }),
    [debounced]
  );

  const fillAditya = () => {
    if (
      !isUntouched(form.getValues()) &&
      !window.confirm("Replace what you have typed with Aditya's letter?")
    )
      return;
    form.reset({ ...ADITYA_COVER_LETTER, date: form.getValues('date') });
  };

  const importPdf = async (file: File | undefined) => {
    if (!file) return;
    const imported = decodeCoverLetterFromPdf(await file.arrayBuffer());
    if (!imported) {
      toast.error(
        'Only cover letters made with this generator can be imported.'
      );
      return;
    }
    if (
      !isUntouched(form.getValues()) &&
      !window.confirm(
        'Replace what you have typed with the imported cover letter?'
      )
    )
      return;
    form.reset(imported);
    toast.success('Cover letter imported.');
  };

  const reset = () => {
    if (!window.confirm("Clear everything? This can't be undone.")) return;
    form.reset(newCoverLetter());
  };

  const download = async () => {
    const letter = form.getValues();
    try {
      await downloadPdf(
        <CoverLetterDocument letter={letter} />,
        fileName(letter)
      );
    } catch {
      toast.error("Couldn't create the PDF. Please try again.");
    }
  };

  return (
    <ToolLayout
      next={{ href: '/resume', label: 'Resume Builder' }}
      actions={
        <>
          <Button type="button" variant="outline" onClick={fillAditya}>
            <RiUserLine /> Fill with Aditya's data
          </Button>
          <label
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'focus-within:ring-ring/30 cursor-pointer focus-within:ring-2'
            )}
          >
            <RiFileUploadLine />
            Import PDF
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
            <RiRefreshLine /> Reset
          </Button>
          <Button type="button" onClick={download}>
            <RiDownloadLine /> Download PDF
          </Button>
        </>
      }
      form={
        <form onSubmit={e => e.preventDefault()} className="space-y-6">
          {FIELDS.map(group => (
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
            <FieldLabel htmlFor="body">Letter</FieldLabel>
            <Textarea
              id="body"
              className="min-h-80"
              {...form.register('body')}
            />
            <FieldDescription>
              Leave a blank line between paragraphs. The greeting and sign-off
              are added for you.
            </FieldDescription>
          </Field>
        </form>
      }
      preview={<PdfPreview {...docs} label="Cover letter preview" />}
    />
  );
};

export default CoverLetterPage;
