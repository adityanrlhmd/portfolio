# Resume Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `/resume` page where anyone fills a form, sees a live PDF in Aditya's resume layout, uploads a photo, reorders entries by dragging, and downloads/re-imports the PDF.

**Architecture:** Pure data + helpers in `src/lib/resume/` (schema, Aditya's data, text helpers, PDF embed/decode, storage, photo). The PDF template and page UI live in `src/pages/resume/`, loaded with `React.lazy` only when `location.pathname` is `/resume`, so `@react-pdf/renderer` never ships with the home page.

**Tech Stack:** `@react-pdf/renderer@4.9.0` (new), React 19, react-hook-form (`useFieldArray`), `motion` (`Reorder`, already installed), zod 4, sonner, Tailwind 4 + `src/components/ui`, vitest + Testing Library. Package manager: bun.

**Spec:** `docs/superpowers/specs/2026-10-22-resume-generator-design.md`

## Global Constraints

- Only new dependency: `@react-pdf/renderer@4.9.0`.
- Home page bundle must not contain `@react-pdf/renderer`.
- Page copy states: "Everything stays in your browser. Nothing is uploaded."
- localStorage key: `resume-generator:v1`. Every read/write in try/catch.
- PDF: Helvetica family, `size="LETTER"`, single column, real text, always black on white.
- Section titles exactly: `Work Experiences`, `Education Level`, `Skills`.
- Import error copy exactly: `Only resumes made with this generator can be imported.`
- Download filename: ``name.trim() ? `${name.trim()} - Resume.pdf` : 'Resume.pdf'``.
- Aditya's data: email `aditya.nrlhamda@gmail.com`; no Angular, Sass, Bootstrap in skills or summary; GovTech bullets as on the site; no photo.
- UI copy in English. Branch `feat/resume-generator`.

## Review Focus

1. **Non-Latin / emoji text** ("José ✓ 李"): Helvetica lacks the glyphs; the PDF must still generate. Test in Task 2.
2. **A PDF from elsewhere, a corrupted file, a non-PDF**: exact import error toast, form untouched. Tests in Task 2 and Task 4.
3. **localStorage full or blocked**: toast "Couldn't save your progress in this browser." once, page keeps working. Test in Task 3.
4. **Stored data from another version / garbled**: blank form, no crash. Test in Task 3.
5. **Reordering then typing**: after a drag, edits go to the item that is now at that position (field ids stay keyed). Test in Task 4.

---

### Task 1: Resume schema + shared data (the site reads it too)

**Files:**

- Modify: `package.json`, `bun.lock` (`bun add @react-pdf/renderer@4.9.0`)
- Create: `src/lib/resume/schema.ts`, `src/lib/resume/aditya.ts`
- Modify: `src/sections/experience.tsx` (drop the inline array, import `EXPERIENCES`)
- Test: `src/lib/resume/__tests__/aditya.test.ts`

**Interfaces:**

- Produces (`schema.ts`): `resumeSchema`, `type Resume = z.infer<typeof resumeSchema>`:
  `{ name, phone, email, location, links /* one per line */, summary, photo /* data URL or '' */, skills /* "Category: items" per line */, experiences: { company, location, duration, role, description, bullets /* one per line */ }[], educations: { school, location, duration, degree }[] }` — all strings `z.string()`. `EMPTY_RESUME: Resume`.
- Produces (`aditya.ts`): `EXPERIENCES: { id, company, role, duration, location, description, jobdesc: string[] }[]` (the site's 7 entries verbatim + location/description from the reference PDF: GovTech `Jakarta, Indonesia`/`''`; Bank Jakarta `Jakarta, Indonesia`/`''`; eDOT `Bandung, Indonesia (Remote)`/`A business partner offering integrated technology and marketing solutions.`; KodX `Jakarta, Indonesia (Remote)`/`The company creates cutting-edge web and mobile apps to optimize business operations and enhance user experiences.`; LESLAR `Jakarta Utara, Indonesia`/`Engaged in blockchain services.`; Trees Studio `Sukabumi, Indonesia`/`''`; OmindTech `Depok, Indonesia`/`Software House and IT Consultant`).
  `ADITYA_RESUME: Resume` — name `Aditya Nurul Hamda`, phone `+6285961082180`, email `aditya.nrlhamda@gmail.com`, links `linkedin.com/in/adityanurulhamda/\nhttps://adityahamda.vercel.app/`, location `Sukabumi, West Java, Indonesia`, summary = reference PDF summary with "with additional proficiency in Vue and Angular" → "with additional proficiency in Vue", experiences from `EXPERIENCES` (`bullets: jobdesc.join('\n')`), education `Universitas Nusa Putra`/`Sukabumi, Indonesia`/`Aug 2018 - Sep 2022`/`Bachelor of Computer Science`, skills = the PDF's 6 lines with `SASS` removed, `photo: ''`.

- [ ] **Step 1:** `git checkout -b feat/resume-generator && bun add @react-pdf/renderer@4.9.0`
- [ ] **Step 2: Failing test** `aditya.test.ts`

```ts
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
```

- [ ] **Step 3:** `bun run test --run src/lib/resume` → FAIL (modules missing).
- [ ] **Step 4:** Implement `schema.ts`, `aditya.ts`; switch `experience.tsx` to `EXPERIENCES` (renders exactly as before).
- [ ] **Step 5:** `bun run test --run && bunx tsc --noEmit` → PASS, no type errors.
- [ ] **Step 6:** `git add package.json bun.lock src/lib/resume src/sections/experience.tsx && git commit -m "feat(resume): add resume schema and share experience data"`

---

### Task 2: PDF template + embedded data round-trip

**Files:**

- Create: `src/lib/resume/format.ts`, `src/lib/resume/embed.ts`, `src/pages/resume/resume-document.tsx`
- Test: `src/lib/resume/__tests__/format.test.ts`, `src/lib/resume/__tests__/embed.test.tsx` (first line `// @vitest-environment node`)

**Interfaces:**

- Consumes: `Resume`, `resumeSchema`, `EMPTY_RESUME`, `ADITYA_RESUME`.
- Produces:
  - `splitLines(text: string): string[]` — trim each line, drop blanks.
  - `contactItems(r: Resume): { text: string; href: string }[]` — order phone (`tel:` + no spaces), email (`mailto:`), each link line (as-is if it starts with `http`, else `https://` + line); empties dropped.
  - `skillLines(text: string): { category: string; items: string }[]` — split on the first `:`; no colon → `{ category: '', items: line }`.
  - `encodeResume(r: Resume): string` → `'resume-data:' + base64(utf8(JSON.stringify({ ...r, photo: '' })))`.
  - `decodeResumeFromPdf(bytes: ArrayBuffer): Resume | null` — react-pdf writes `/Subject` as an uncompressed literal string (verified in a spike), so: `new TextDecoder('latin1').decode(bytes).match(/\(resume-data:([A-Za-z0-9+/=]+)\)/)` → `atob` → UTF-8 decode → `JSON.parse` → `resumeSchema.safeParse`; any failure → `null`.
  - `ResumeDocument({ resume }: { resume: Resume })` — `<Document title={name || 'Resume'} author={name} subject={encodeResume(resume)}>` + one `<Page size="LETTER">`.

- [ ] **Step 1: Failing tests**

`format.test.ts`:

```ts
expect(splitLines(' a \n\n  b\n')).toEqual(['a', 'b']);
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
expect(skillLines('Mobile: React Native, Expo\nGit')).toEqual([
  { category: 'Mobile', items: 'React Native, Expo' },
  { category: '', items: 'Git' },
]);
```

`embed.test.tsx` (helper `render = async (r) => (await pdf(<ResumeDocument resume={r} />).toBlob()).arrayBuffer()`):

```ts
it('round-trips a resume, without the photo', async () => {
  const r = { ...ADITYA_RESUME, photo: 'data:image/jpeg;base64,AAAA' };
  expect(decodeResumeFromPdf(await render(r))).toEqual({ ...r, photo: '' });
});
it('survives non-Latin text and parentheses', async () => {
  const r = { ...EMPTY_RESUME, name: 'José (QA) 李 ✓ \\' };
  expect(decodeResumeFromPdf(await render(r))?.name).toBe(r.name);
});
it('renders an empty resume', async () => {
  expect((await render(EMPTY_RESUME)).byteLength).toBeGreaterThan(0);
});
it('returns null for PDFs not made here, garbage, and tampered data', async () => {
  const other = await (await pdf(<Document><Page><Text>hi</Text></Page></Document>).toBlob()).arrayBuffer();
  expect(decodeResumeFromPdf(other)).toBeNull();
  expect(decodeResumeFromPdf(new TextEncoder().encode('not a pdf').buffer)).toBeNull();
  expect(decodeResumeFromPdf(new TextEncoder().encode('(resume-data:e30=)').buffer)).toBeNull();
});
```

- [ ] **Step 2:** `bun run test --run src/lib/resume` → FAIL.
- [ ] **Step 3:** Implement. Layout (tune by eye in Task 4): page padding 36pt; Helvetica 9.5pt, line height 1.35, `#111`. Header: name Helvetica-Bold 22pt uppercase; contact line 8.5pt `#8a8a8a`, `<Link>`s joined by `|`; location same gray; summary. Photo `<Image>` 64×64 `objectFit: 'cover'` top-right when `photo`. Section title Helvetica-Bold 12pt with `borderBottom: 1pt solid #111`, margin-top 12pt; section skipped when empty. Entry (indent 6pt): header row `View minPresenceAhead={40}` = bold company + gray ` - location` (only if set) left, duration right; role Helvetica-Oblique; gray description if set; `•` bullets with 10pt hanging indent. Education: header row + oblique degree. Skills: `•` rows, bold category + `: ` + items (no category → items only). Empty fields render nothing.
- [ ] **Step 4:** `bun run test --run src/lib/resume` → PASS.
- [ ] **Step 5:** `git add src/lib/resume src/pages/resume/resume-document.tsx && git commit -m "feat(resume): add PDF template with embedded form data"`

---

### Task 3: Storage + photo

**Files:**

- Create: `src/lib/resume/storage.ts`, `src/lib/resume/photo.ts`
- Test: `src/lib/resume/__tests__/storage.test.ts`

**Interfaces:**

- Produces:
  - `STORAGE_KEY = 'resume-generator:v1'`; `loadResume(): Resume | null` (missing / unparsable / schema-invalid / access throws → `null`); `saveResume(r: Resume): boolean` (`false` when `setItem` throws); `clearResume(): void`.
  - `toSquareJpeg(file: File, size = 256): Promise<string>` — rejects `Error('Please choose an image file.')` unless `file.type.startsWith('image/')`; `createImageBitmap` → center-crop → canvas → `toDataURL('image/jpeg', 0.85)`. (jsdom has no real canvas: checked by hand in Task 4.)

- [ ] **Step 1: Failing test** `storage.test.ts`

```ts
beforeEach(() => localStorage.clear());
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
it('returns false when storage is full', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  expect(saveResume(ADITYA_RESUME)).toBe(false);
});
```

- [ ] **Step 2:** `bun run test --run src/lib/resume` → FAIL.
- [ ] **Step 3:** Implement both files.
- [ ] **Step 4:** `bun run test --run` → PASS.
- [ ] **Step 5:** `git add src/lib/resume && git commit -m "feat(resume): save progress locally and shrink uploaded photos"`

---

### Task 4: The `/resume` page

**Files:**

- Create: `src/pages/resume/resume-page.tsx` (default export), `src/pages/resume/resume-form.tsx`, `src/pages/resume/resume-preview.tsx`
- Modify: `src/main.tsx` — `location.pathname.replace(/\/$/, '') === '/resume'` → `lazy(() => import('@/pages/resume/resume-page'))` in `Suspense` (fallback `<Spinner />`), else `App`.
- Modify: `src/sections/hero.tsx` — second CTA `<a href="/resume">Build Your Resume</a>` with `buttonVariants({ variant: 'outline', size: 'lg' })` next to "Let's Connect".
- Create: `vercel.json` — `{ "rewrites": [{ "source": "/resume", "destination": "/index.html" }] }`
- Test: `src/pages/resume/__tests__/resume-page.test.tsx`

**Interfaces:**

- Consumes: Tasks 1–3, `ResumeDocument`, `ThemeProvider`, `Toaster`, `ToggleButton`, `Logo`, `Accordion*`, `Button`, `Input`, `Textarea`, `Label`, `Spinner`, `useMediaQuery`, `Reorder`/`useDragControls` from `motion/react`.
- Produces: `ResumePage()`; `ResumeForm({ form }: { form: UseFormReturn<Resume> })`; `ResumePreview({ resume }: { resume: Resume })`.

Behavior:

- **Header:** `Logo` → `/`, "Resume Builder", privacy line, `ToggleButton`. Wrapped in `ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"` + `Toaster`.
- **Form state:** `useForm<Resume>({ defaultValues: loadResume() ?? EMPTY_RESUME })`; `values = useWatch({ control })`; `debounced` = values after 400ms (inline `useEffect` + `setTimeout`, no new hook file).
- **Autosave:** effect on `debounced` → `saveResume`; on `false` → `toast.error("Couldn't save your progress in this browser.")`, once per load (ref flag).
- **Toolbar (exact labels):** `Fill with Aditya's data` (confirm `Replace what you have typed with Aditya's data?` only when values ≠ `EMPTY_RESUME`; then `reset(ADITYA_RESUME)`); `Import PDF` (labelled hidden `<input type="file" accept="application/pdf">`; `null` → error toast from Global Constraints, form untouched; else `reset({ ...decoded, photo: values.photo })` + `toast.success('Resume imported.')`; clear the input value after); `Reset` (confirm `Clear everything? This can't be undone.` → `reset(EMPTY_RESUME)` + `clearResume()`); `Download PDF` (renders from current `getValues()`, not the debounced copy; filename from Global Constraints; revoke URL after click).
- **Form sections** (`Accordion`, Personal open): Personal — `Full name`, `Phone`, `Email`, `Location`, `Links` (textarea, hint "One per line"), photo picker (`toSquareJpeg`, errors → `toast.error(err.message)`) + thumbnail + `Remove photo`. Summary textarea. Experience and Education via `useFieldArray`: `Add experience` / `Add education` → `prepend(empty)`; each item has a drag handle button (`aria-label="Drag to reorder"`) and `Remove` (`aria-label="Remove"`). Bullets textarea hint "One bullet per line". Skills textarea hint "One group per line, e.g. Mobile: React Native, Expo".
- **Drag to reorder:** `<Reorder.Group axis="y" values={fields} onReorder={next => move(fields.indexOf(moved), next.indexOf(moved))}>` with `Reorder.Item key={field.id} value={field} dragListener={false} dragControls={controls}`; handle `onPointerDown={e => controls.start(e)}`, `style={{ touchAction: 'none' }}`; handle `onKeyDown` ArrowUp/ArrowDown → `move(i, i ∓ 1)` within bounds. Fields keep `register(\`experiences.${i}.company\`)` names by index.
- **Preview:** effect on `resume` → `pdf(<ResumeDocument resume={resume} />).toBlob()`; cancel flag in cleanup so a late older render is dropped; `setUrl` only when ready (old PDF stays meanwhile); revoke the previous URL after swap and on unmount. `<iframe title="Resume preview">` + `Open PDF` link (`target="_blank"`, `rel="noreferrer"`).
- **Layout:** `useMediaQuery('(min-width: 1024px)')`: desktop two columns, preview `sticky` full height; mobile `Edit` / `Preview` buttons (`aria-pressed`), one panel shown. No horizontal scroll at 375px.

- [ ] **Step 1: Failing tests** (mock `@react-pdf/renderer`: components as passthrough stubs, `pdf: () => ({ toBlob: async () => new Blob(['%PDF']) })`; stub `URL.createObjectURL`/`revokeObjectURL`; `localStorage.clear()` before each)

```ts
it('starts blank', () => { render(<ResumePage />); expect(screen.getByLabelText('Full name')).toHaveValue(''); });
it("fills Aditya's data on click", async () => {
  render(<ResumePage />);
  await user.click(screen.getByRole('button', { name: "Fill with Aditya's data" }));
  expect(screen.getByLabelText('Full name')).toHaveValue('Aditya Nurul Hamda');
});
it('asks before overwriting typed data, keeps it on cancel', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(false);
  render(<ResumePage />);
  await user.type(screen.getByLabelText('Full name'), 'Budi');
  await user.click(screen.getByRole('button', { name: "Fill with Aditya's data" }));
  expect(window.confirm).toHaveBeenCalled();
  expect(screen.getByLabelText('Full name')).toHaveValue('Budi');
});
it('restores saved progress', () => {
  saveResume({ ...EMPTY_RESUME, name: 'Sari' });
  render(<ResumePage />);
  expect(screen.getByLabelText('Full name')).toHaveValue('Sari');
});
it('rejects a PDF not made here and leaves the form alone', async () => {
  render(<ResumePage />);
  await user.upload(screen.getByLabelText('Import PDF'), new File(['%PDF-1.4 hi'], 'cv.pdf', { type: 'application/pdf' }));
  expect(await screen.findByText('Only resumes made with this generator can be imported.')).toBeInTheDocument();
  expect(screen.getByLabelText('Full name')).toHaveValue('');
});
it('moves an experience down with the keyboard and keeps edits on the right item', async () => {
  saveResume({ ...EMPTY_RESUME, experiences: [{ ...blankExp, company: 'A' }, { ...blankExp, company: 'B' }] });
  render(<ResumePage />);
  screen.getAllByRole('button', { name: 'Drag to reorder' })[0].focus();
  await user.keyboard('{ArrowDown}');
  const companies = screen.getAllByLabelText('Company');
  expect(companies.map(c => (c as HTMLInputElement).value)).toEqual(['B', 'A']);
  await user.type(companies[0], '!');
  expect((screen.getAllByLabelText('Company')[0] as HTMLInputElement).value).toBe('B!');
});
```

- [ ] **Step 2:** `bun run test --run src/pages` → FAIL.
- [ ] **Step 3:** Implement the page files, `main.tsx`, `hero.tsx`, `vercel.json`.
- [ ] **Step 4:** `bun run test --run && bun run lint && bun run build` → all pass.
- [ ] **Step 5:** `grep -l "pdfkit" dist/assets/index-*.js || echo "home clean"` → `home clean`.
- [ ] **Step 6: Hand check** (`bun run dev`, `/resume`): fill with Aditya's data, download, compare against `Aditya Nurul Hamda - July 2026.pdf` and tune `resume-document.tsx` spacing; upload a large JPEG and a PNG (square, top-right, survives reload); drag entries with mouse and in touch emulation; import the downloaded PDF after `Reset` (every field returns); 375px width: tabs work, `Open PDF` works, no horizontal scroll; theme toggle changes the page, not the PDF.
- [ ] **Step 7:** `git add src/pages src/main.tsx src/sections/hero.tsx vercel.json && git commit -m "feat(resume): add resume builder page with live PDF preview"`
