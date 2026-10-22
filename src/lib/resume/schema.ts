import { z } from 'zod';

// Multi-line fields (links, skills, bullets) hold one item per line.
export const resumeSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  location: z.string(),
  links: z.string(),
  summary: z.string(),
  photo: z.string(),
  skills: z.string(),
  experiences: z.array(
    z.object({
      company: z.string(),
      location: z.string(),
      duration: z.string(),
      role: z.string(),
      description: z.string(),
      bullets: z.string(),
    })
  ),
  educations: z.array(
    z.object({
      school: z.string(),
      location: z.string(),
      duration: z.string(),
      degree: z.string(),
    })
  ),
});

export type Resume = z.infer<typeof resumeSchema>;

export const EMPTY_RESUME: Resume = {
  name: '',
  phone: '',
  email: '',
  location: '',
  links: '',
  summary: '',
  photo: '',
  skills: '',
  experiences: [],
  educations: [],
};
