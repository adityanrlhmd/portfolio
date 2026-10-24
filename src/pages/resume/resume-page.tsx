import {
  RiDownloadLine,
  RiFileUploadLine,
  RiRefreshLine,
  RiUserLine,
} from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ToolLayout } from '@/components/tool-layout';
import { Button, buttonVariants } from '@/components/ui/button';

import { useAutosave } from '@/hooks/use-autosave';

import { ADITYA_RESUME } from '@/lib/aditya';
import { decodeResumeFromPdf } from '@/lib/resume/embed';
import { EMPTY_RESUME, type Resume } from '@/lib/resume/schema';
import { clearResume, loadResume, saveResume } from '@/lib/resume/storage';
import { cn } from '@/lib/utils';

import { downloadResume } from './download';
import { ResumeForm } from './resume-form';
import { ResumePreview } from './resume-preview';

const isBlank = (resume: Resume) =>
  JSON.stringify(resume) === JSON.stringify(EMPTY_RESUME);

const ResumeBuilder = () => {
  const form = useForm<Resume>({
    defaultValues: loadResume() ?? EMPTY_RESUME,
  });
  const debounced = useAutosave(form, saveResume);

  const fillAditya = () => {
    if (
      !isBlank(form.getValues()) &&
      !window.confirm("Replace what you have typed with Aditya's data?")
    )
      return;
    form.reset(ADITYA_RESUME);
  };

  const importPdf = async (file: File | undefined) => {
    if (!file) return;
    const imported = decodeResumeFromPdf(await file.arrayBuffer());
    if (!imported) {
      toast.error('Only resumes made with this generator can be imported.');
      return;
    }
    if (
      !isBlank(form.getValues()) &&
      !window.confirm('Replace what you have typed with the imported resume?')
    )
      return;
    form.reset({ ...imported, photo: form.getValues('photo') });
    toast.success('Resume imported.');
  };

  const resetAll = () => {
    if (!window.confirm("Clear everything? This can't be undone.")) return;
    form.reset(EMPTY_RESUME);
    clearResume();
  };

  return (
    <ToolLayout
      next={{ href: '/cover-letter', label: 'Cover Letter' }}
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
          <Button type="button" variant="outline" onClick={resetAll}>
            <RiRefreshLine /> Reset
          </Button>
          <Button
            type="button"
            onClick={() => downloadResume(form.getValues())}
          >
            <RiDownloadLine /> Download PDF
          </Button>
        </>
      }
      form={<ResumeForm form={form} />}
      preview={<ResumePreview resume={debounced} />}
    />
  );
};

export default ResumeBuilder;
