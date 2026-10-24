import { ADITYA_RESUME, EXPERIENCES } from '../aditya';
import { EMPTY_RESUME, resumeSchema } from '../resume/schema';

describe('ADITYA_RESUME', () => {
  it('ADITYA_RESUME and EMPTY_RESUME are valid', () => {
    expect(resumeSchema.safeParse(ADITYA_RESUME).success).toBe(true);
    expect(resumeSchema.safeParse(EMPTY_RESUME).success).toBe(true);
  });

  it('uses the latest email and no photo', () => {
    expect(ADITYA_RESUME.email).toBe('aditya.nrlhamda@gmail.com');
    expect(ADITYA_RESUME.photo).toBe('');
  });

  it('never mentions Angular, Sass or Bootstrap in skills or summary', () => {
    expect(ADITYA_RESUME.skills + ADITYA_RESUME.summary).not.toMatch(
      /angular|sass|bootstrap/i
    );
  });

  it('experiences come from the site data, newest first', () => {
    expect(ADITYA_RESUME.experiences.map(e => e.company)).toEqual(
      EXPERIENCES.map(e => e.company)
    );
    expect(ADITYA_RESUME.experiences[0].company).toBe('GovTech Procurement');
    expect(ADITYA_RESUME.experiences[0].bullets.split('\n')).toEqual(
      EXPERIENCES[0].jobdesc
    );
  });
});
