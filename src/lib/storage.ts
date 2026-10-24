import type { ZodType } from 'zod';

// null when nothing is saved, the data no longer fits the schema, or storage is blocked.
export const loadStored = <T>(key: string, schema: ZodType<T>): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

// false when the browser refuses (storage full, blocked, private mode).
export const saveStored = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const clearStored = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // nothing stored to clear
  }
};
