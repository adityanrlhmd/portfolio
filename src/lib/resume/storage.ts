import { type Resume, resumeSchema } from './schema';

export const STORAGE_KEY = 'resume-generator:v1';

export const loadResume = (): Resume | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = resumeSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

// false when the browser refuses (storage full, blocked, private mode).
export const saveResume = (resume: Resume) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    return true;
  } catch {
    return false;
  }
};

export const clearResume = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing stored to clear
  }
};
