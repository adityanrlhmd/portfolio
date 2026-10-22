import { ADITYA_RESUME } from '../aditya';
import { STORAGE_KEY, loadResume, saveResume } from '../storage';

describe('resume storage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('round-trips', () => {
    expect(saveResume(ADITYA_RESUME)).toBe(true);
    expect(loadResume()).toEqual(ADITYA_RESUME);
  });

  it('returns null for nothing or garbage', () => {
    expect(loadResume()).toBeNull();
    localStorage.setItem(STORAGE_KEY, '{oops');
    expect(loadResume()).toBeNull();
    localStorage.setItem(STORAGE_KEY, '{"name":1}');
    expect(loadResume()).toBeNull();
  });

  it('loads progress saved before achievements existed', () => {
    const older: Partial<typeof ADITYA_RESUME> = { ...ADITYA_RESUME };
    delete older.achievements;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(older));
    expect(loadResume()).toEqual({ ...ADITYA_RESUME, achievements: '' });
  });

  it('returns false when storage is full', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    expect(saveResume(ADITYA_RESUME)).toBe(false);
  });
});
