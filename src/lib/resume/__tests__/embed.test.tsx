// @vitest-environment node
import { ResumeDocument } from '@/pages/resume/resume-document';
import { Document, Page, Text, pdf } from '@react-pdf/renderer';

import { ADITYA_RESUME } from '../aditya';
import { decodeResumeFromPdf } from '../embed';
import { PLACEHOLDER_RESUME } from '../placeholder';
import { EMPTY_RESUME, type Resume } from '../schema';

const render = async (resume: Resume) =>
  (await pdf(<ResumeDocument resume={resume} />).toBlob()).arrayBuffer();

const bytes = (text: string) => new TextEncoder().encode(text).buffer;

describe('resume data embedded in the PDF', () => {
  it('round-trips a resume, without the photo', async () => {
    const resume = { ...ADITYA_RESUME, photo: 'data:image/jpeg;base64,AAAA' };
    expect(decodeResumeFromPdf(await render(resume))).toEqual({
      ...resume,
      photo: '',
    });
  });

  it('survives non-Latin text and parentheses', async () => {
    const resume = { ...EMPTY_RESUME, name: 'José (QA) 李 ✓ \\' };
    expect(decodeResumeFromPdf(await render(resume))?.name).toBe(resume.name);
  });

  it('renders an empty resume', async () => {
    expect((await render(EMPTY_RESUME)).byteLength).toBeGreaterThan(0);
  });

  it('keeps placeholders out of the embedded data', async () => {
    const blob = await pdf(
      <ResumeDocument resume={EMPTY_RESUME} placeholder={PLACEHOLDER_RESUME} />
    ).toBlob();
    expect(decodeResumeFromPdf(await blob.arrayBuffer())).toEqual(EMPTY_RESUME);
  });

  it('returns null for PDFs not made here, garbage, and tampered data', async () => {
    const other = await (
      await pdf(
        <Document>
          <Page>
            <Text>hi</Text>
          </Page>
        </Document>
      ).toBlob()
    ).arrayBuffer();
    expect(decodeResumeFromPdf(other)).toBeNull();
    expect(decodeResumeFromPdf(bytes('not a pdf'))).toBeNull();
    expect(decodeResumeFromPdf(bytes('(resume-data:e30=)'))).toBeNull();
  });
});
