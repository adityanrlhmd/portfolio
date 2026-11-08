import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useId, useMemo, useState } from 'react';

import { useLang } from '@/components/language-provider';
import { ShinyText } from '@/components/shiny-text';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const T = translations(
  {
    eyebrow: "⚡︎ Let's Connect",
    title: 'Contact',
    intro:
      "Open to new roles, freelance work, or just a chat about frontend. Drop me a message and I'll get back to you soon.",
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Submit',
    sent: 'Message sent successfully!',
    failed: 'Failed to send message.',
    errors: {
      nameMin: 'Name must be at least 2 characters.',
      nameMax: 'Name must be at most 32 characters.',
      email: 'Invalid email address.',
      messageMin: 'Message is required.',
      messageMax: 'Message must be at most 500 characters.',
    },
  },
  {
    eyebrow: '⚡︎ Yuk Ngobrol',
    title: 'Kontak',
    intro:
      'Lagi terbuka buat posisi baru, kerjaan freelance, atau sekadar ngobrol soal frontend. Kirim pesan aja, nanti aku balas secepatnya.',
    name: 'Nama',
    email: 'Email',
    message: 'Pesan',
    submit: 'Kirim',
    sent: 'Pesan terkirim!',
    failed: 'Pesan gagal terkirim.',
    errors: {
      nameMin: 'Nama minimal 2 karakter.',
      nameMax: 'Nama maksimal 32 karakter.',
      email: 'Email-nya nggak valid.',
      messageMin: 'Pesannya jangan kosong ya.',
      messageMax: 'Pesan maksimal 500 karakter.',
    },
  }
);

const contactSchema = (errors: (typeof T)['en']['errors']) =>
  z.object({
    name: z.string().min(2, errors.nameMin).max(32, errors.nameMax),
    email: z.string().email(errors.email),
    message: z.string().min(1, errors.messageMin).max(500, errors.messageMax),
  });

type ContactForm = z.infer<ReturnType<typeof contactSchema>>;

const Contact = () => {
  const formId = useId();
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const { lang } = useLang();
  const t = T[lang];
  const schema = useMemo(() => contactSchema(T[lang].errors), [lang]);

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (data: ContactForm) => {
    setIsLoadingSubmit(true);
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { ...data, reply_to: data.email },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          toast.success(t.sent);
          contactForm.reset();
        },
        () => {
          toast.error(t.failed);
        }
      )
      .finally(() => {
        setIsLoadingSubmit(false);
      });
  };

  return (
    <section id="contact" className="py-16 sm:scroll-mt-(--header-height)">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <ShinyText
            text={t.eyebrow}
            speed={2}
            delay={0}
            color="var(--primary)"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="text-primary font-bold"
          />
          <h2 className="text-4xl font-bold lg:text-5xl lg:leading-tight">
            {t.title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {t.intro}
          </p>
        </div>

        <form
          id={formId}
          onSubmit={contactForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={contactForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={nameId}>{t.name}</FieldLabel>
                  <Input {...field} id={nameId} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={contactForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={emailId}>{t.email}</FieldLabel>
                  <Input {...field} id={emailId} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="message"
              control={contactForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={messageId}>{t.message}</FieldLabel>
                  <Textarea
                    {...field}
                    id={messageId}
                    rows={5}
                    className="resize-none"
                  />
                  <div className="flex items-center">
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <span
                      className={cn(
                        'text-muted-foreground ml-auto text-xs',
                        field.value.length > 500 && 'text-destructive'
                      )}
                    >
                      {field.value.length}/{500}
                    </span>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            size="xl"
            className="w-full"
            isLoading={isLoadingSubmit}
          >
            {t.submit}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
