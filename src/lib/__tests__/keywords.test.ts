import { compareSkills, findSkills } from '../keywords';

describe('findSkills', () => {
  it('counts each skill once per mention, across its spellings', () => {
    const found = findSkills('ReactJS and React.js, plus react hooks');
    expect(found.get('React')).toBe(3);
  });

  it('does not count a shorter skill inside a longer one', () => {
    const found = findSkills('React Native, JavaScript and Java');
    expect(found.get('React Native')).toBe(1);
    expect(found.has('React')).toBe(false);
    expect(found.get('JavaScript')).toBe(1);
    expect(found.get('Java')).toBe(1);
  });

  it('handles symbols and word edges', () => {
    const found = findSkills('C++, C#, .NET and Node.js; scaled nodes');
    expect([...found.keys()]).toEqual(
      expect.arrayContaining(['C++', 'C#', '.NET', 'Node.js'])
    );
    expect(findSkills('we excel at teamwork').has('Excel')).toBe(false);
    expect(findSkills('Advanced Excel').has('Excel')).toBe(true);
  });

  it('knows general and Indonesian skills too', () => {
    const found = findSkills(
      'Menguasai Microsoft Excel, akuntansi dan komunikasi yang baik'
    );
    expect([...found.keys()]).toEqual(
      expect.arrayContaining(['Excel', 'Accounting', 'Communication'])
    );
  });
});

describe('compareSkills', () => {
  it('splits the job post skills into missing (most mentioned first) and matched', () => {
    const result = compareSkills(
      'Built apps with React and TypeScript',
      'React, Docker. Docker and Kubernetes. Must know TypeScript.'
    );
    expect(result.missing.map(s => s.name)).toEqual(['Docker', 'Kubernetes']);
    expect(result.missing[0].count).toBe(2);
    expect(result.matched.map(s => s.name)).toEqual(['React', 'TypeScript']);
  });
});
