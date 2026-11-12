import { RiArrowRightLine, RiGithubFill } from '@remixicon/react';

import { useLang } from '@/components/language-provider';
import { buttonVariants } from '@/components/ui/button';

import { CASE_STUDY } from '@/lib/config';
import { translations } from '@/lib/i18n';

import { CaseStudyArticle, type CaseStudyCopy } from './case-study-article';

const SOURCE = 'https://github.com/adityanrlhmd/portfolio';
const TOOL = '/tools/resume';

// a simplified src/lib/pdf-data.ts, shown after the first paragraph of its section
const EMBED_CODE = `// the form, as JSON, inside the PDF's Subject field
const utf8 = new TextEncoder().encode(JSON.stringify(resume));
const subject = \`resume-data:\${btoa(String.fromCharCode(...utf8))}\`;`;

const T = translations<CaseStudyCopy & { tryIt: string; source: string }>(
  {
    eyebrow: '⚡︎ Case Study',
    title: 'A resume builder that needs no server',
    lead: 'A free resume builder where nothing you type leaves your browser, and the PDF you download doubles as your save file.',
    facts: [
      ['Role', 'Solo: design, code, and tests'],
      [
        'Stack',
        'React 19, TypeScript, React Hook Form, Zod, React PDF, pdf.js, Vitest',
      ],
    ],
    sections: [
      {
        title: 'The problem',
        paragraphs: [
          'Most free resume builders ask for an account first, keep your data on their server, or put the PDF download behind a paywall. I wanted one that is actually free: no sign-up, no backend, nothing uploaded.',
          'But if nothing is stored anywhere, how do you open your resume again next month to update it?',
        ],
      },
      {
        title: 'The PDF is the save file',
        paragraphs: [
          "When you download, the whole form goes into the PDF itself: JSON, base64-encoded, in the document's Subject field with a `resume-data:` prefix. Import that same PDF later and the form fills itself back in. The file you send to recruiters is also your backup, and it works on any device.",
          'Reading it back needs no PDF parser. React PDF writes the Subject as a plain, uncompressed string, so a regex over the raw bytes finds it. What comes out goes through the same Zod schema as the form, so a PDF from somewhere else, or one edited by hand, gets a friendly "only resumes made here can be imported" instead of a broken form.',
          'Two details: the photo stays out of the embedded copy to keep the file small (you add it again after importing), and a round-trip test uses a name like `José (QA) 李 ✓`, since base64 alone mangles anything outside Latin-1 unless the text is turned into UTF-8 bytes first.',
        ],
        code: EMBED_CODE,
      },
      {
        title: 'Autosave without an account',
        paragraphs: [
          'Between downloads, the form saves to localStorage 200 ms after you stop typing. Closing the tab right after typing would lose those last keystrokes, so it also saves on `pagehide`.',
          "Saved data is checked with Zod when the page loads. A field added later gets a default, so progress saved by an older version still loads (there's a test for exactly that), and anything that doesn't fit is ignored instead of crashing the page. If the browser refuses to store anything, in private mode or with full storage, you get one warning instead of losing work silently.",
        ],
      },
      {
        title: "A live preview that doesn't flicker",
        paragraphs: [
          'The preview is the real PDF, rebuilt as you type. In an iframe it flashed blank on every update, jumped back to the top, and showed only the first page on iOS. So the pages are drawn with pdf.js onto canvases, and the new set replaces the old one only once it is fully ready: no flash, the scroll position stays, and every page shows on phones.',
          "Sections you haven't filled in show faded sample content, so you can see where things will go. That sample lives only in the preview. The download and the embedded data never include it, and a test checks that.",
        ],
      },
      {
        title: 'Keeping the portfolio fast',
        paragraphs: [
          "The PDF library is big: about 1.2 MB, 443 kB gzipped. The builder lives on the same site as my portfolio, and a recruiter opening the home page shouldn't pay for it. So it sits in its own chunk that loads only on the tool pages, or when someone clicks My Resume on the home page, since my own CV is made with this builder too.",
        ],
      },
      {
        title: 'The small things that took longest',
        paragraphs: [
          'iOS Safari ignores the download attribute for a PDF blob and opens a preview instead. Serving the file as `application/octet-stream` makes it download, and the blob URL stays alive for 40 seconds because Safari can start the download late.',
          "Link previews on WhatsApp and LinkedIn don't run JavaScript, so a shared /tools link showed my portfolio's title. The build now writes a copy of the page with the tools' own title and description, and fails if the text it replaces ever changes, rather than quietly shipping the wrong preview.",
        ],
      },
      {
        title: 'Trade-offs',
        paragraphs: [
          'Your data lives in one browser until you download. Clear the site data before that and the draft is gone; the PDF is the real backup.',
          "Anyone with the PDF can read the embedded data. It's the same information printed on the page.",
          'Import only works for PDFs made here. Reading any resume would mean guessing its structure from free text, which is a different and far less reliable tool.',
        ],
      },
    ],
    tryIt: 'Try the builder',
    source: 'Source on GitHub',
    next: 'Next case study: Saku, a household finance tracker',
    back: 'Back to portfolio',
  },
  {
    eyebrow: '⚡︎ Studi Kasus',
    title: 'Pembuat CV yang nggak butuh server',
    lead: 'Pembuat CV gratis yang isiannya nggak pernah keluar dari browser, dan PDF yang kamu download sekaligus jadi file save-nya.',
    facts: [
      ['Peran', 'Solo: desain, kode, dan test'],
      [
        'Stack',
        'React 19, TypeScript, React Hook Form, Zod, React PDF, pdf.js, Vitest',
      ],
    ],
    sections: [
      {
        title: 'Masalahnya',
        paragraphs: [
          'Kebanyakan pembuat CV gratis minta bikin akun dulu, nyimpen data kamu di server mereka, atau ngunci download PDF di balik paywall. Aku pengen yang beneran gratis: nggak perlu daftar, nggak ada backend, nggak ada yang di-upload.',
          'Tapi kalau nggak ada yang disimpan di mana pun, gimana caranya buka CV itu lagi bulan depan buat di-update?',
        ],
      },
      {
        title: 'PDF-nya sekaligus file save',
        paragraphs: [
          'Pas kamu download, seluruh isi form ikut masuk ke dalam PDF-nya: JSON yang di-encode base64, disimpan di field Subject dokumen dengan prefix `resume-data:`. Import PDF yang sama nanti, form-nya langsung keisi lagi. File yang kamu kirim ke recruiter jadi backup juga, dan bisa dibuka di device mana aja.',
          'Bacanya balik juga nggak butuh parser PDF. React PDF nulis Subject sebagai string biasa yang nggak dikompres, jadi cukup regex di byte mentahnya. Hasilnya dicek pakai schema Zod yang sama dengan form, jadi PDF dari tempat lain atau yang diedit manual dapat pesan "cuma CV yang dibikin di sini yang bisa di-import", bukan form yang rusak.',
          'Dua detail: foto nggak ikut disimpan biar file-nya tetap kecil (tinggal pasang lagi setelah import), dan ada test round-trip pakai nama kayak `José (QA) 李 ✓`, soalnya base64 doang bakal ngerusak karakter di luar Latin-1 kalau teksnya nggak diubah jadi byte UTF-8 dulu.',
        ],
        code: EMBED_CODE,
      },
      {
        title: 'Autosave tanpa akun',
        paragraphs: [
          'Di antara download, form-nya ke-save ke localStorage 200 ms setelah kamu berhenti ngetik. Kalau tab ditutup tepat setelah ngetik, ketikan terakhir bisa hilang, jadi form juga di-save pas `pagehide`.',
          'Data yang tersimpan dicek pakai Zod waktu halaman dibuka. Field yang ditambah belakangan dapat nilai default, jadi progress dari versi lama tetap kebuka (ada test khusus buat itu), dan yang nggak cocok diabaikan, bukan bikin halaman crash. Kalau browser nolak nyimpen, misalnya mode private atau storage penuh, muncul satu peringatan, bukan kerjaan yang hilang diam-diam.',
        ],
      },
      {
        title: 'Preview live yang nggak kedip',
        paragraphs: [
          'Preview-nya PDF asli yang dibikin ulang tiap kamu ngetik. Waktu masih pakai iframe, tiap update layarnya kedip kosong, scroll balik ke atas, dan di iOS cuma halaman pertama yang muncul. Jadi halamannya digambar pakai pdf.js ke canvas, dan set yang baru baru gantiin yang lama setelah semuanya siap: nggak kedip, posisi scroll tetap, semua halaman muncul di HP.',
          'Bagian yang belum diisi nampilin contoh isi yang dipudarkan, biar kelihatan nanti bakal jadi kayak apa. Contoh itu cuma ada di preview. File download dan data yang disisipkan nggak pernah ikut, dan ada test yang ngecek itu.',
        ],
      },
      {
        title: 'Portfolio tetap ringan',
        paragraphs: [
          'Library PDF-nya gede: sekitar 1,2 MB, 443 kB setelah gzip. Tool ini numpang di situs yang sama dengan portfolioku, dan recruiter yang buka halaman utama nggak seharusnya ikut nanggung bebannya. Jadi library-nya dipisah ke chunk sendiri yang cuma dimuat di halaman tools, atau pas ada yang klik Download CV di halaman utama, karena CV-ku sendiri juga dibikin pakai builder ini.',
        ],
      },
      {
        title: 'Hal kecil yang paling makan waktu',
        paragraphs: [
          'Safari di iOS nyuekin atribut download buat blob PDF dan malah buka preview. Solusinya file dikirim sebagai `application/octet-stream` biar beneran ke-download, dan URL blob-nya dibiarin hidup 40 detik karena Safari bisa telat mulai download-nya.',
          'Preview link di WhatsApp dan LinkedIn nggak jalanin JavaScript, jadi link /tools yang di-share malah nampilin judul portfolioku. Sekarang proses build nulis salinan halaman dengan judul dan deskripsi tools sendiri, dan build-nya gagal kalau teks yang diganti berubah, daripada diam-diam ngirim preview yang salah.',
        ],
      },
      {
        title: 'Trade-off',
        paragraphs: [
          'Data kamu cuma ada di satu browser sampai kamu download. Kalau data situs kehapus sebelum itu, draft-nya hilang; backup yang beneran ya PDF-nya.',
          'Siapa pun yang pegang PDF-nya bisa baca data yang disisipkan. Isinya sama dengan yang tercetak di halaman.',
          'Import cuma jalan buat PDF yang dibikin di sini. Kalau mau baca CV apa pun, strukturnya harus ditebak dari teks bebas, dan itu tool yang beda dan jauh kurang bisa diandalkan.',
        ],
      },
    ],
    tryIt: 'Coba pembuat CV-nya',
    source: 'Source code di GitHub',
    next: 'Studi kasus berikutnya: Saku, pencatat keuangan keluarga',
    back: 'Balik ke portfolio',
  }
);

const ResumeBuilderCaseStudy = () => {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <CaseStudyArticle
      t={t}
      nextHref={CASE_STUDY.saku}
      actions={
        <div className="flex flex-wrap gap-3">
          <a href={TOOL} className={buttonVariants()}>
            {t.tryIt} <RiArrowRightLine />
          </a>
          <a
            href={SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'outline' })}
          >
            <RiGithubFill /> {t.source}
          </a>
        </div>
      }
    />
  );
};

export default ResumeBuilderCaseStudy;
