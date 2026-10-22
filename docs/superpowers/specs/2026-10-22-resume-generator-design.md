# Resume Generator — Design

## Intent

A `/resume` page on the portfolio where anyone fills a form and sees their resume as a PDF update live next to it, then downloads it. The PDF looks like Aditya's own resume (`Aditya Nurul Hamda - July 2026.pdf`). Aditya uses it to keep his CV current from the same data as the site; visitors use it as a free resume builder with his template.

## Goals

- Form on the left, live PDF preview on the right (tabs "Edit / Preview" on mobile).
- Blank form on first visit. A "Fill with Aditya's data" button fills every field.
- Photo upload, optional (remove it to hide it).
- Experience and Education entries can be dragged to reorder (mouse, touch, and ↑/↓ keys on the drag handle), so a mistake doesn't mean retyping.
- Work survives closing the tab (localStorage).
- A PDF made by this page can be uploaded again to restore every field.
- Everything runs in the browser. Nothing is sent to a server. The page says so.

## Non-goals (for now)

- Parsing resumes made elsewhere (would need AI + a backend + per-use cost). Uploading one shows a clear "only PDFs made here are supported" message.
- WYSIWYG / rich text, including `**bold**` in bullets.
- Other templates, manual photo cropping, reordering whole sections, custom section titles.
- Email format checks and a required name before download (an empty name downloads as `Resume.pdf`).
- A loading spinner on the preview (the previous PDF stays visible instead).

## Anti-goals

- Slowing down the portfolio home page. The PDF library must only load on `/resume`.
- A PDF that is an image or otherwise unreadable by ATS. Text stays real text.
- Losing someone's typed work (reload, closed tab, storage full without telling them).

## Constraints

- Stack already in place: Vite 8, React 19, TypeScript, Tailwind 4, shadcn-style UI in `src/components/ui`, react-hook-form + zod, sonner toasts, vitest. Package manager is bun.
- New dependency: `@react-pdf/renderer` (v4, React 19 compatible). No others unless unavoidable.
- No router in the app. Deployed on Vercel with no `vercel.json`, so `/resume` needs an SPA rewrite.

## Decided

**Storage:** localStorage, debounced autosave of the whole form, including the photo as a compressed data URL. A "Reset" button clears it (with confirm). Reads/writes wrapped in try/catch; a quota error shows a toast instead of failing silently.

**Default data:** the button fills from one shared data file that the site's Experience section also reads (move the array out of `src/sections/experience.tsx`, the site keeps rendering the same thing).

- Experience: the website's entries and wording (newest, includes GovTech).
- From the PDF (not on the site yet): summary, phone, location, links, education, skill categories, and per-job location + one-line company description. These live in the shared file; the site doesn't show them.
- Email: `aditya.nrlhamda@gmail.com`. Skills: drop Angular, Sass, Bootstrap.
- GovTech bullets stay generic as they are on the site (no internal client terms).

**Upload / re-import:** the form data (without the photo, to keep the PDF small) is serialized into the PDF's metadata on download. Upload reads it back and fills the form. Any PDF without that data → toast "Only resumes made with this generator can be imported". A round-trip test (generate → read back → equal) is required.

**PDF layout (match the reference PDF):** Helvetica, US Letter, single column.

- Name: large, bold, uppercase. Contact line in gray, items joined with `|`. Location in gray. Summary paragraph.
- Section headings "Work Experiences", "Education Level", "Skills": bold with a full-width rule under them.
- Experience entry: **Company** + ` - Location` in gray bold on the left, duration right-aligned; _role_ italic; optional company description in gray; bullet list.
- Education entry: same header row; _degree_ italic.
- Skills: bullets of **Category**: items.
- Empty sections and empty fields are not rendered (no orphan headings or stray separators).
- Photo (when present): small square in the top-right, aligned with the name block. Without a photo the layout is identical to the reference.
- The PDF is always black on white; the page's light/dark theme toggle doesn't affect it.

**Form:**

- Sections in an Accordion: Personal (name, phone, email, links, location, photo), Summary, Experience, Education, Skills.
- Experience/Education are lists: add (new entry goes on top, since resumes are newest first), remove, drag to reorder using `motion`'s `Reorder` (already a dependency).
- Bullets, links and skills are textareas, one line each, blank lines ignored. A skills line is `Category: items`; the part before the first `:` is bold.
- Duration is free text ("Jun 2026 - Present"), same as the site data.

**Preview:** debounced (~400ms) render to a blob shown in an iframe. Keep showing the previous PDF until the new one is ready, so typing doesn't flicker.

**Photo:** accept images only; resize/center-crop to a small square JPEG in a canvas before storing.

**Download:** file named `<Name> - Resume.pdf`, or `Resume.pdf` when the name is empty.

**Page header:** logo back to `/`, title, privacy line, and the site's theme toggle.

## Calls made by Claude (not discussed, easy to change)

- "Fill with Aditya's data" asks for confirmation when the form already has content, since it overwrites it.
- The default fill has no photo, matching the reference PDF.
- The summary drops "and Angular", consistent with the skills rule.
- US Letter, because the reference PDF is Letter. A4 is a one-line change.
- Links (email, LinkedIn, website) are clickable in the PDF.
- An entry's header row never sits alone at the bottom of a page (it moves to the next page with its first bullets).
- Page UI copy is in English, like the rest of the site.

## Left to the builder

- How `/resume` is wired without a router (e.g. pathname check in `main.tsx` + `React.lazy`), plus the Vercel rewrite.
- Where the entry point to `/resume` sits on the site (header nav or hero CTA) and the page's own header/back link. Reuse existing components and theme.
- Exact metadata field used for the embedded data and how it is read back, as long as the round-trip test passes.
- Mobile preview fallback if the iframe doesn't render multi-page PDFs on iOS (e.g. an "Open PDF" button).
- Image type check on photo upload.
