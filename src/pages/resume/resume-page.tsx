import {
  RiDownloadLine,
  RiFileUploadLine,
  RiRefreshLine,
  RiUserLine,
} from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useT } from '@/components/language-provider';
import { PdfLangToggle } from '@/components/pdf-lang-toggle';
import { ToolLayout } from '@/components/tool-layout';
import { Button, buttonVariants } from '@/components/ui/button';

import { useAutosave } from '@/hooks/use-autosave';
import { usePdfLang } from '@/hooks/use-pdf-lang';

import { ADITYA_RESUME } from '@/lib/aditya';
import { COMMON, translations } from '@/lib/i18n';
import { decodeResumeFromPdf } from '@/lib/resume/embed';
import { EMPTY_RESUME, type Resume } from '@/lib/resume/schema';
import { clearResume, loadResume, saveResume } from '@/lib/resume/storage';
import { cn } from '@/lib/utils';

import { downloadResume } from './download';
import { ResumeForm } from './resume-form';
import { ResumePreview } from './resume-preview';

const T = translations(
  {
    replaceWithAditya: "Replace what you have typed with Aditya's data?",
    importOnlyOurs: 'Only resumes made with this generator can be imported.',
    replaceWithImport: 'Replace what you have typed with the imported resume?',
    imported: 'Resume imported.',
  },
  {
    replaceWithAditya: 'Timpa isian kamu pakai data Aditya?',
    importOnlyOurs:
      'Cuma CV yang dibikin di generator ini yang bisa di-import.',
    replaceWithImport: 'Timpa isian kamu pakai CV yang di-import?',
    imported: 'CV berhasil di-import.',
  }
);

const isBlank = (resume: Resume) =>
  JSON.stringify(resume) === JSON.stringify(EMPTY_RESUME);

const ResumeBuilder = () => {
  const form = useForm<Resume>({
    defaultValues: loadResume() ?? EMPTY_RESUME,
  });
  const debounced = useAutosave(form, saveResume);
  const t = { ...useT(COMMON), ...useT(T) };
  const [pdfLang, setPdfLang] = usePdfLang();

  const fillAditya = () => {
    if (!isBlank(form.getValues()) && !window.confirm(t.replaceWithAditya))
      return;
    form.reset(ADITYA_RESUME);
  };

  const importPdf = async (file: File | undefined) => {
    if (!file) return;
    const imported = decodeResumeFromPdf(await file.arrayBuffer());
    if (!imported) {
      toast.error(t.importOnlyOurs);
      return;
    }
    if (!isBlank(form.getValues()) && !window.confirm(t.replaceWithImport))
      return;
    form.reset({ ...imported, photo: form.getValues('photo') });
    toast.success(t.imported);
  };

  const resetAll = () => {
    if (!window.confirm(t.clearAll)) return;
    form.reset(EMPTY_RESUME);
    clearResume();
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
          <Button type="button" variant="outline" onClick={resetAll}>
            <RiRefreshLine /> {t.reset}
          </Button>
          <Button
            type="button"
            onClick={() => downloadResume(form.getValues(), pdfLang)}
          >
            <RiDownloadLine /> {t.downloadPdf}
          </Button>
          <PdfLangToggle value={pdfLang} onChange={setPdfLang} />
        </>
      }
      form={<ResumeForm form={form} />}
      preview={<ResumePreview resume={debounced} lang={pdfLang} />}
    />
  );
};

export default ResumeBuilder;
