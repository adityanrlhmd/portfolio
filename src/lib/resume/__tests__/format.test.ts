import { contactItems, skillLines, splitLines } from '../format';
import { EMPTY_RESUME } from '../schema';

describe('resume format helpers', () => {
  it('splitLines trims lines and drops blanks', () => {
    expect(splitLines(' a \n\n  b\n')).toEqual(['a', 'b']);
  });

  it('contactItems builds links in order and drops empties', () => {
    expect(
      contactItems({
        ...EMPTY_RESUME,
        phone: '+62 859',
        email: 'x@y.co',
        links: 'linkedin.com/in/x\n\nhttps://a.dev',
      })
    ).toEqual([
      { text: '+62 859', href: 'tel:+62859' },
      { text: 'x@y.co', href: 'mailto:x@y.co' },
      { text: 'linkedin.com/in/x', href: 'https://linkedin.com/in/x' },
      { text: 'https://a.dev', href: 'https://a.dev' },
    ]);
    expect(contactItems(EMPTY_RESUME)).toEqual([]);
  });

  it('skillLines splits on the first colon', () => {
    expect(skillLines('Mobile: React Native, Expo\nGit')).toEqual([
      { category: 'Mobile', items: 'React Native, Expo' },
      { category: '', items: 'Git' },
    ]);
  });
});
