import emailjs from '@emailjs/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useId, useState } from 'react';

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

import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(32, 'Name must be at most 32 characters.'),
  email: z.string().email('Invalid email address.'),
  message: z
    .string()
    .min(1, 'Message must be at least 1 characters.')
    .max(500, 'Message must be at most 500 characters.'),
});

const Contact = () => {
  const formId = useId();
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
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
          toast.success('Message sent successfully!');
          contactForm.reset();
        },
        () => {
          toast.error('Failed to send message.');
        }
      )
      .finally(() => {
        setIsLoadingSubmit(false);
      });
  };

  return (
    <section id="contact" className="scroll-mt-(--header-height) py-16">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <ShinyText
            text="⚡︎ Let's Connect"
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
            Contact
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            I'm always open to new opportunities and would love to hear from
            you. Whether it's a challenging project, a potential collaboration,
            or just a chat about technology, feel free to reach out.
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
                  <FieldLabel htmlFor={nameId}>Name</FieldLabel>
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
                  <FieldLabel htmlFor={emailId}>Email</FieldLabel>
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
                  <FieldLabel htmlFor={messageId}>Message</FieldLabel>
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
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
