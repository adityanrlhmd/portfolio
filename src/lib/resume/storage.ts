import { clearStored, loadStored, saveStored } from '../storage';
import { type Resume, resumeSchema } from './schema';

export const STORAGE_KEY = 'resume-generator:v1';

export const loadResume = () => loadStored(STORAGE_KEY, resumeSchema);

export const saveResume = (resume: Resume) => saveStored(STORAGE_KEY, resume);

export const clearResume = () => clearStored(STORAGE_KEY);
