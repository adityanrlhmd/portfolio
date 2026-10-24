// @vitest-environment node
import { pdf } from '@react-pdf/renderer';

import {
  ADITYA_COVER_LETTER,
  type CoverLetter,
  PLACEHOLDER_COVER_LETTER,
  decodeCoverLetterFromPdf,
} from '@/lib/cover-letter';
import { decodeResumeFromPdf } from '@/lib/resume/embed';

import { CoverLetterDocument } from '../cover-letter-document';

const letter: CoverLetter = {
  ...ADITYA_COVER_LETTER,
  date: 'October 24, 2026',
  company: 'José (QA) 李 ✓',
};
const empty: CoverLetter = { ...letter, name: '', company: '', body: '' };

describe('cover letter data embedded in the PDF', () => {
  it('round-trips a letter, and only as a cover letter', async () => {
    const bytes = await (
      await pdf(<CoverLetterDocument letter={letter} />).toBlob()
    ).arrayBuffer();
    expect(decodeCoverLetterFromPdf(bytes)).toEqual(letter);
    expect(decodeResumeFromPdf(bytes)).toBeNull();
  });

  it('keeps placeholders out of the embedded data', async () => {
    const blob = await pdf(
      <CoverLetterDocument
        letter={empty}
        placeholder={PLACEHOLDER_COVER_LETTER}
      />
    ).toBlob();
    expect(decodeCoverLetterFromPdf(await blob.arrayBuffer())).toEqual(empty);
  });
});
