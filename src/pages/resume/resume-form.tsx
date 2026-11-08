import { Collapsible } from '@base-ui/react/collapsible';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDeleteBinLine,
  RiDraggable,
  RiImageAddLine,
} from '@remixicon/react';
import { Reorder, useDragControls } from 'motion/react';
import {
  type FieldPath,
  type UseFormReturn,
  useFieldArray,
} from 'react-hook-form';
import { toast } from 'sonner';

import { type ReactNode, useEffect, useState } from 'react';

import { useT } from '@/components/language-provider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { translations } from '@/lib/i18n';
import { type Crop, toSquareJpeg } from '@/lib/resume/photo';
import type { Resume } from '@/lib/resume/schema';
import { cn } from '@/lib/utils';

import { PhotoCropper } from './photo-cropper';

type Form = UseFormReturn<Resume>;

const T = translations(
  {
    personal: 'Personal',
    fullName: 'Full name',
    phone: 'Phone',
    email: 'Email',
    location: 'Location',
    links: 'Links',
    onePerLine: 'One per line',
    photo: 'Photo',
    yourPhoto: 'Your photo',
    changePhoto: 'Change photo',
    uploadPhoto: 'Upload photo',
    removePhoto: 'Remove photo',
    notAnImage: 'Please choose an image file.',
    cantOpenImage: "This image can't be opened here. Try a JPG or PNG.",
    summary: 'Summary',
    experience: 'Experience',
    addExperience: 'Add experience',
    newExperience: 'New experience',
    company: 'Company',
    role: 'Role',
    duration: 'Duration',
    durationHint: 'e.g. Jan 2024 - Present',
    companyDescription: 'Company description (optional)',
    whatYouDid: 'What you did',
    oneBulletPerLine: 'One bullet per line',
    education: 'Education',
    addEducation: 'Add education',
    newEducation: 'New education',
    school: 'School',
    degree: 'Degree',
    skills: 'Skills',
    skillsHint: 'One group per line, e.g. Mobile: React Native, Expo',
    achievements: 'Certifications & Achievements',
    achievementsHint: 'One per line. Left empty, it stays off the PDF.',
    drag: 'Drag to reorder',
    remove: 'Remove',
  },
  {
    personal: 'Data diri',
    fullName: 'Nama lengkap',
    phone: 'Telepon',
    email: 'Email',
    location: 'Lokasi',
    links: 'Tautan',
    onePerLine: 'Satu per baris',
    photo: 'Foto',
    yourPhoto: 'Foto kamu',
    changePhoto: 'Ganti foto',
    uploadPhoto: 'Upload foto',
    removePhoto: 'Hapus foto',
    notAnImage: 'Pilih file gambar ya.',
    cantOpenImage:
      'Gambar ini nggak bisa dibuka di sini. Coba pakai JPG atau PNG.',
    summary: 'Ringkasan',
    experience: 'Pengalaman',
    addExperience: 'Tambah pengalaman',
    newExperience: 'Pengalaman baru',
    company: 'Perusahaan',
    role: 'Posisi',
    duration: 'Periode',
    durationHint: 'contoh: Jan 2024 - Sekarang',
    companyDescription: 'Deskripsi perusahaan (opsional)',
    whatYouDid: 'Yang kamu kerjain',
    oneBulletPerLine: 'Satu poin per baris',
    education: 'Pendidikan',
    addEducation: 'Tambah pendidikan',
    newEducation: 'Pendidikan baru',
    school: 'Sekolah/kampus',
    degree: 'Gelar',
    skills: 'Keahlian',
    skillsHint: 'Satu kelompok per baris, contoh: Mobile: React Native, Expo',
    achievements: 'Sertifikasi & Prestasi',
    achievementsHint:
      'Satu per baris. Kalau dikosongin, bagian ini nggak muncul di PDF.',
    drag: 'Geser buat ubah urutan',
    remove: 'Hapus',
  }
);

const TextField = ({
  form,
  name,
  label,
  hint,
  multiline,
  hideLabel,
}: {
  form: Form;
  name: FieldPath<Resume>;
  label: string;
  hint?: string;
  multiline?: boolean;
  // for a field that is alone in its section, whose title already names it
  hideLabel?: boolean;
}) => (
  <Field>
    <FieldLabel htmlFor={name} className={cn(hideLabel && 'sr-only')}>
      {label}
    </FieldLabel>
    {multiline ? (
      <Textarea id={name} className="min-h-24" {...form.register(name)} />
    ) : (
      <Input id={name} {...form.register(name)} />
    )}
    {hint && <FieldDescription>{hint}</FieldDescription>}
  </Field>
);

const Section = ({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: ReactNode;
}) => (
  <AccordionItem value={value}>
    <AccordionTrigger className="text-sm">{title}</AccordionTrigger>
    <AccordionContent className="space-y-4 pt-2">{children}</AccordionContent>
  </AccordionItem>
);

const SortableItem = ({
  id,
  title,
  placeholder,
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  id: string;
  title: string;
  placeholder: string;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  children: ReactNode;
}) => {
  const controls = useDragControls();
  const t = useT(T);

  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      // "position" moves neighbours without stretching the item while it resizes
      layout="position"
      className="bg-background rounded-md border p-2"
    >
      {/* collapsed entries are easier to drag; blank (new) ones open for typing */}
      <Collapsible.Root defaultOpen={!title}>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t.drag}
            className="cursor-grab touch-none"
            onPointerDown={e => controls.start(e)}
            onKeyDown={e => {
              const to =
                e.key === 'ArrowUp'
                  ? index - 1
                  : e.key === 'ArrowDown'
                    ? index + 1
                    : -1;
              if (to < 0 || to >= count) return;
              e.preventDefault();
              onMove(index, to);
            }}
          >
            <RiDraggable />
          </Button>
          <Collapsible.Trigger className="group/trigger flex min-w-0 flex-1 items-center justify-between gap-2 py-1 text-start text-sm outline-none focus-visible:underline">
            <span className="truncate">{title || placeholder}</span>
            <RiArrowDownSLine className="text-muted-foreground size-4 shrink-0 group-data-[panel-open]/trigger:hidden" />
            <RiArrowUpSLine className="text-muted-foreground hidden size-4 shrink-0 group-data-[panel-open]/trigger:inline" />
          </Collapsible.Trigger>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t.remove}
            onClick={onRemove}
          >
            <RiDeleteBinLine />
          </Button>
        </div>
        <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0">
          <div className="space-y-3 px-1 pt-2 pb-1">{children}</div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Reorder.Item>
  );
};

const useSortable = <N extends 'experiences' | 'educations'>(
  form: Form,
  name: N
) => {
  const array = useFieldArray({ control: form.control, name });
  const ids = array.fields.map(field => field.id);

  // motion hands back the new order; translate it into a single move
  const onReorder = (next: string[]) => {
    const first = ids.findIndex((id, i) => id !== next[i]);
    if (first === -1) return;
    let last = ids.length - 1;
    while (ids[last] === next[last]) last--;
    if (next[first] === ids[last]) array.move(last, first);
    else array.move(first, last);
  };

  return { ...array, ids, onReorder };
};

export const ResumeForm = ({ form }: { form: Form }) => {
  const t = useT(T);
  const experiences = useSortable(form, 'experiences');
  const educations = useSortable(form, 'educations');
  const photo = form.watch('photo');
  const watchedExperiences = form.watch('experiences');
  const watchedEducations = form.watch('educations');
  const titleOf = (...parts: (string | undefined)[]) =>
    parts.filter(Boolean).join(' — ');

  // the picked photo waits here, shown in the cropper, until the visitor confirms it
  const [picked, setPicked] = useState<{ file: File; url: string }>();
  useEffect(
    () => () => {
      if (picked) URL.revokeObjectURL(picked.url);
    },
    [picked]
  );

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t.notAnImage);
      return;
    }
    setPicked({ file, url: URL.createObjectURL(file) });
  };

  const confirmPhoto = async (crop: Crop) => {
    if (!picked) return;
    try {
      const photo = await toSquareJpeg(picked.file, crop);
      form.setValue('photo', photo, { shouldDirty: true });
      setPicked(undefined);
    } catch {
      toast.error(t.cantOpenImage);
    }
  };

  return (
    <Accordion defaultValue={['personal']} multiple>
      <Section value="personal" title={t.personal}>
        <TextField form={form} name="name" label={t.fullName} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField form={form} name="phone" label={t.phone} />
          <TextField form={form} name="email" label={t.email} />
        </div>
        <TextField form={form} name="location" label={t.location} />
        <TextField
          form={form}
          name="links"
          label={t.links}
          hint={t.onePerLine}
          multiline
        />
        <Field>
          <FieldLabel htmlFor="photo">{t.photo}</FieldLabel>
          <div className="flex items-center gap-3">
            {photo && (
              <img
                src={photo}
                alt={t.yourPhoto}
                className="size-14 rounded-md object-cover"
              />
            )}
            <label
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'focus-within:ring-ring/30 cursor-pointer focus-within:ring-2'
              )}
            >
              <RiImageAddLine />
              {photo ? t.changePhoto : t.uploadPhoto}
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={e => {
                  onPhoto(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
            {photo && (
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  form.setValue('photo', '', { shouldDirty: true })
                }
              >
                {t.removePhoto}
              </Button>
            )}
          </div>
          {picked && (
            <PhotoCropper
              src={picked.url}
              onDone={confirmPhoto}
              onCancel={() => setPicked(undefined)}
              onError={() => {
                toast.error(t.cantOpenImage);
                setPicked(undefined);
              }}
            />
          )}
        </Field>
      </Section>

      <Section value="summary" title={t.summary}>
        <TextField
          form={form}
          name="summary"
          label={t.summary}
          multiline
          hideLabel
        />
      </Section>

      <Section value="experience" title={t.experience}>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            experiences.prepend({
              company: '',
              location: '',
              duration: '',
              role: '',
              description: '',
              bullets: '',
            })
          }
        >
          <RiAddLine /> {t.addExperience}
        </Button>
        <Reorder.Group
          axis="y"
          values={experiences.ids}
          onReorder={experiences.onReorder}
          className="space-y-3"
        >
          {experiences.fields.map((field, i) => (
            <SortableItem
              key={field.id}
              id={field.id}
              title={titleOf(
                watchedExperiences[i]?.company,
                watchedExperiences[i]?.role
              )}
              placeholder={t.newExperience}
              index={i}
              count={experiences.fields.length}
              onMove={experiences.move}
              onRemove={() => experiences.remove(i)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  form={form}
                  name={`experiences.${i}.company`}
                  label={t.company}
                />
                <TextField
                  form={form}
                  name={`experiences.${i}.role`}
                  label={t.role}
                />
                <TextField
                  form={form}
                  name={`experiences.${i}.location`}
                  label={t.location}
                />
                <TextField
                  form={form}
                  name={`experiences.${i}.duration`}
                  label={t.duration}
                  hint={t.durationHint}
                />
              </div>
              <TextField
                form={form}
                name={`experiences.${i}.description`}
                label={t.companyDescription}
              />
              <TextField
                form={form}
                name={`experiences.${i}.bullets`}
                label={t.whatYouDid}
                hint={t.oneBulletPerLine}
                multiline
              />
            </SortableItem>
          ))}
        </Reorder.Group>
      </Section>

      <Section value="education" title={t.education}>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            educations.prepend({
              school: '',
              location: '',
              duration: '',
              degree: '',
            })
          }
        >
          <RiAddLine /> {t.addEducation}
        </Button>
        <Reorder.Group
          axis="y"
          values={educations.ids}
          onReorder={educations.onReorder}
          className="space-y-3"
        >
          {educations.fields.map((field, i) => (
            <SortableItem
              key={field.id}
              id={field.id}
              title={titleOf(
                watchedEducations[i]?.school,
                watchedEducations[i]?.degree
              )}
              placeholder={t.newEducation}
              index={i}
              count={educations.fields.length}
              onMove={educations.move}
              onRemove={() => educations.remove(i)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  form={form}
                  name={`educations.${i}.school`}
                  label={t.school}
                />
                <TextField
                  form={form}
                  name={`educations.${i}.degree`}
                  label={t.degree}
                />
                <TextField
                  form={form}
                  name={`educations.${i}.location`}
                  label={t.location}
                />
                <TextField
                  form={form}
                  name={`educations.${i}.duration`}
                  label={t.duration}
                />
              </div>
            </SortableItem>
          ))}
        </Reorder.Group>
      </Section>

      <Section value="skills" title={t.skills}>
        <TextField
          form={form}
          name="skills"
          hideLabel
          label={t.skills}
          hint={t.skillsHint}
          multiline
        />
      </Section>

      <Section value="achievements" title={t.achievements}>
        <TextField
          form={form}
          name="achievements"
          hideLabel
          label={t.achievements}
          hint={t.achievementsHint}
          multiline
        />
      </Section>
    </Accordion>
  );
};
