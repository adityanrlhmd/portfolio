import {
  RiAddLine,
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

import type { ReactNode } from 'react';

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

import { toSquareJpeg } from '@/lib/resume/photo';
import type { Resume } from '@/lib/resume/schema';
import { cn } from '@/lib/utils';

type Form = UseFormReturn<Resume>;

const TextField = ({
  form,
  name,
  label,
  hint,
  multiline,
}: {
  form: Form;
  name: FieldPath<Resume>;
  label: string;
  hint?: string;
  multiline?: boolean;
}) => (
  <Field>
    <FieldLabel htmlFor={name}>{label}</FieldLabel>
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
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  id: string;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  children: ReactNode;
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      className="bg-background space-y-3 rounded-md border p-3"
    >
      <div className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Drag to reorder"
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Remove"
          onClick={onRemove}
        >
          <RiDeleteBinLine />
        </Button>
      </div>
      {children}
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
  const experiences = useSortable(form, 'experiences');
  const educations = useSortable(form, 'educations');
  const photo = form.watch('photo');

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    try {
      form.setValue('photo', await toSquareJpeg(file), { shouldDirty: true });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Accordion defaultValue={['personal']} multiple>
      <Section value="personal" title="Personal">
        <TextField form={form} name="name" label="Full name" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField form={form} name="phone" label="Phone" />
          <TextField form={form} name="email" label="Email" />
        </div>
        <TextField form={form} name="location" label="Location" />
        <TextField
          form={form}
          name="links"
          label="Links"
          hint="One per line"
          multiline
        />
        <Field>
          <FieldLabel htmlFor="photo">Photo</FieldLabel>
          <div className="flex items-center gap-3">
            {photo && (
              <img
                src={photo}
                alt="Your photo"
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
              {photo ? 'Change photo' : 'Upload photo'}
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
                Remove photo
              </Button>
            )}
          </div>
        </Field>
      </Section>

      <Section value="summary" title="Summary">
        <TextField form={form} name="summary" label="Summary" multiline />
      </Section>

      <Section value="experience" title="Experience">
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
          <RiAddLine /> Add experience
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
              index={i}
              count={experiences.fields.length}
              onMove={experiences.move}
              onRemove={() => experiences.remove(i)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  form={form}
                  name={`experiences.${i}.company`}
                  label="Company"
                />
                <TextField
                  form={form}
                  name={`experiences.${i}.role`}
                  label="Role"
                />
                <TextField
                  form={form}
                  name={`experiences.${i}.location`}
                  label="Location"
                />
                <TextField
                  form={form}
                  name={`experiences.${i}.duration`}
                  label="Duration"
                  hint="e.g. Jan 2024 - Present"
                />
              </div>
              <TextField
                form={form}
                name={`experiences.${i}.description`}
                label="Company description (optional)"
              />
              <TextField
                form={form}
                name={`experiences.${i}.bullets`}
                label="What you did"
                hint="One bullet per line"
                multiline
              />
            </SortableItem>
          ))}
        </Reorder.Group>
      </Section>

      <Section value="education" title="Education">
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
          <RiAddLine /> Add education
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
              index={i}
              count={educations.fields.length}
              onMove={educations.move}
              onRemove={() => educations.remove(i)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  form={form}
                  name={`educations.${i}.school`}
                  label="School"
                />
                <TextField
                  form={form}
                  name={`educations.${i}.degree`}
                  label="Degree"
                />
                <TextField
                  form={form}
                  name={`educations.${i}.location`}
                  label="Location"
                />
                <TextField
                  form={form}
                  name={`educations.${i}.duration`}
                  label="Duration"
                />
              </div>
            </SortableItem>
          ))}
        </Reorder.Group>
      </Section>

      <Section value="skills" title="Skills">
        <TextField
          form={form}
          name="skills"
          label="Skills"
          hint="One group per line, e.g. Mobile: React Native, Expo"
          multiline
        />
      </Section>
    </Accordion>
  );
};
