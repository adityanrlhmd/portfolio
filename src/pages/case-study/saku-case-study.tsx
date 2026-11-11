import { RiExternalLinkLine, RiPlayFill } from '@remixicon/react';

import { useRef } from 'react';

import features from '@/assets/projects/saku/features.jpg';
import goals from '@/assets/projects/saku/goals.jpg';
import money from '@/assets/projects/saku/money.jpg';
import poster from '@/assets/projects/saku/promo-poster.jpg';
import sync from '@/assets/projects/saku/sync.jpg';
import themes from '@/assets/projects/saku/themes.jpg';
import web from '@/assets/projects/saku/web.jpg';

import { useLang } from '@/components/language-provider';
import { Button, buttonVariants } from '@/components/ui/button';

import { CASE_STUDY } from '@/lib/config';
import { translations } from '@/lib/i18n';

import { CaseStudyArticle, type CaseStudyCopy } from './case-study-article';

const WEB = 'https://saku-aditt.vercel.app';
// in public/, so the 2.5 MB file stays out of the bundle and loads only on play
const VIDEO = '/videos/saku-promo.mp4';

// every gallery shot is 1600x1000
const shot = (src: string, alt: string) => ({
  src,
  alt,
  width: 1600,
  height: 1000,
});

const T = translations<
  CaseStudyCopy & { watch: string; open: string; apps: string; video: string }
>(
  {
    eyebrow: '⚡︎ Case Study',
    title: 'A family budget that two phones can share',
    lead: 'Saku keeps your money in one place, whether you track it alone or with the whole family, and everyone in a household can record a transaction from their own phone or laptop. It runs on the web, Android and iOS, in Indonesian and English, and costs nothing to run.',
    facts: [
      ['Role', 'Solo: product, design, web, mobile, database'],
      [
        'Stack',
        'Next.js 16, Expo (React Native), Supabase (Postgres, Realtime, Storage), TanStack Query, Zod, NativeWind, Tailwind, Vitest, Jest, Playwright',
      ],
    ],
    sections: [
      {
        title: 'The problem',
        paragraphs: [
          'Our household’s money was spread across two bank accounts, a couple of e-wallets, cash, some gold and a credit card. A shared spreadsheet broke the moment two people edited it from their phones. The apps we tried were either single-person, or they kept the useful parts behind a subscription.',
          'I wanted one place where both of us could record spending as it happens and see the same numbers straight away, on whichever device was in hand.',
        ],
        images: [shot(features, 'Saku’s home, wallet and analysis screens')],
      },
      {
        title: 'One household, everyone’s pockets',
        paragraphs: [
          'Every row belongs to a household, and Postgres row-level security does the access checks, not the app. A wallet can be shared or someone’s own. A transaction can be marked as belonging to one member or to several, so “how much did I spend” and “how much did we spend” both come from the same data.',
          'Joining a household takes an invite link or a QR code. Leaving one takes the wallets that only you own into a personal space, and the shared ones stay with the family. Using Saku alone works the same way: it’s a household of one, and nothing in the app waits for a partner.',
        ],
      },
      {
        title: 'Real time without running a server',
        paragraphs: [
          'When Ani saves an expense on her phone, Budi’s laptop shows it a moment later, with no server of my own in between. A Postgres trigger broadcasts a small `{ table, op, by }` message on the household’s Supabase Realtime channel. Each app listens and refreshes only the TanStack Query caches that table feeds.',
          'The writer’s own screen doesn’t wait for the round trip either: every change is optimistic, and a failed one rolls back.',
        ],
        images: [
          shot(sync, 'An expense saved on the phone appearing on the laptop'),
        ],
      },
      {
        title: 'Money rules live in one place',
        paragraphs: [
          'Two apps that each compute a balance their own way will, sooner or later, disagree. So the web and the phone hold no money rules themselves. Both import one shared TypeScript package with the Zod schemas and row builders for everything they write. Some of the rules in there:',
        ],
        list: [
          '**Credit cards bill by statement cycle.** The bill closes on a cut-off day and is due on another, both clamped for short months. The app separates what the statement still asks for from what was spent after the cut-off, counted on the user’s local day, never in SQL, where `current_date` is UTC and would say yesterday for the first seven hours of every Jakarta day.',
          '**Gold is held in grams.** Its rupiah value follows a daily price snapshot, and each gold wallet can use its own shop’s price.',
          '**History stays true.** A wallet can switch between everyday spending and savings. Each past transaction is judged by what its wallet was on that date, so flipping a wallet doesn’t quietly rewrite last month.',
        ],
        images: [
          shot(money, 'Quick entry and a credit card bill split by statement'),
        ],
      },
      {
        title: 'Indonesian and English',
        paragraphs: [
          'The whole app works in both languages, on the web and on the phone, and anyone in the family can pick their own. Both apps render every word from one pair of locale files, and a test fails if a key exists in only one language or only one app renders it.',
        ],
        images: [shot(goals, 'Savings goals on the web and on the phone')],
      },
      {
        title: 'Shipping to a family for free',
        paragraphs: [
          'The app had to stay free, to build and to use: no paid push service and no store fees.',
        ],
        list: [
          '**Android installs from the web app.** The APK sits at one fixed address, and the download button and QR code on the web always point to it.',
          '**Most fixes go out over the air** with EAS Update, so nobody reinstalls. Only a native change needs a new APK.',
          '**Reminders are local notifications**, not paid push.',
        ],
      },
      {
        title: 'Make it feel like theirs',
        paragraphs: [
          'There are nine accent colours and nineteen backgrounds, from plain tints to batik, plus your own photo, all defined once in the shared package. The accents are in OKLCH and tested for contrast, and the colours that carry meaning for money (income green, expense red) never move. A photo background gets a scrim tested to keep headings at 4.5:1 or better over any picture.',
        ],
        images: [
          shot(themes, 'Dark and light themes with different accent colours'),
          shot(web, 'The web dashboard in the light theme'),
        ],
      },
      {
        title: 'Trade-offs',
        paragraphs: [],
        list: [
          '**No bank import.** Every transaction is entered by hand. That keeps bank credentials out of the app, at the cost of some typing.',
          '**Not in the stores yet.** Android installs as an APK from the web app and the iPhone build is installed locally. Fine for a family, but not a public launch.',
        ],
      },
      {
        title: 'By the numbers',
        paragraphs: [],
        list: [
          'About 1,000 commits since July 2026',
          '64 database migrations',
          '520+ mobile unit tests, plus Vitest suites for the shared package and the web, and a Playwright smoke test for the auth guard',
        ],
      },
      {
        title: 'What’s next',
        paragraphs: ['Some of what I’m exploring, not promises:'],
        list: [
          '**Record by chat.** Parents who’d rather not install an app could log spending from WhatsApp in plain words, with a confirmation before anything is saved.',
          '**Ask your own AI assistant.** Connect Saku to an assistant like Claude and ask “how much did we spend on food this month?”',
          '**Investments.** Mutual funds, stocks and time deposits, next to the wallets and gold already there.',
          '**Offline for everything.** A new transaction already saves without signal. Edits, budgets and goals are next, once there’s a clear rule for when two people change the same thing while one of them is offline.',
          '**Scan a receipt** into its line items.',
          '**Play Store and App Store release.**',
        ],
      },
    ],
    watch: 'Watch the video',
    open: 'Open Saku',
    apps: 'Android: download the APK from the web app · Play Store & App Store: coming soon',
    video: 'Saku promo video',
    next: 'Next case study: a resume builder that needs no server',
    back: 'Back to portfolio',
  },
  {
    eyebrow: '⚡︎ Studi Kasus',
    title: 'Anggaran keluarga yang bisa dipakai bareng dari dua HP',
    lead: 'Saku ngumpulin uangmu di satu tempat, mau dicatat sendiri atau bareng satu keluarga, dan tiap anggota rumah tangga bisa nyatet transaksi dari HP atau laptop masing-masing. Jalan di web, Android, dan iOS, bisa bahasa Indonesia dan Inggris, dan biaya jalaninnya nol.',
    facts: [
      ['Peran', 'Solo: produk, desain, web, mobile, database'],
      [
        'Stack',
        'Next.js 16, Expo (React Native), Supabase (Postgres, Realtime, Storage), TanStack Query, Zod, NativeWind, Tailwind, Vitest, Jest, Playwright',
      ],
    ],
    sections: [
      {
        title: 'Masalahnya',
        paragraphs: [
          'Uang di rumah kami kesebar di dua rekening bank, beberapa e-wallet, uang tunai, sedikit emas, dan satu kartu kredit. Spreadsheet bareng langsung berantakan begitu dua orang ngedit dari HP. Aplikasi yang kami coba kalau nggak cuma buat satu orang, ya fitur pentingnya dikunci di balik langganan.',
          'Aku pengen satu tempat di mana kami berdua bisa nyatet pengeluaran pas kejadian dan langsung lihat angka yang sama, dari device apa pun yang lagi dipegang.',
        ],
        images: [shot(features, 'Layar beranda, wallet, dan analisis Saku')],
      },
      {
        title: 'Satu rumah tangga, banyak kantong',
        paragraphs: [
          'Tiap baris data punya rumah tangganya sendiri, dan yang ngecek akses itu row-level security di Postgres, bukan aplikasinya. Wallet bisa dipakai bareng atau punya satu orang. Transaksi bisa ditandai punya satu anggota atau beberapa, jadi “aku habis berapa” dan “kita habis berapa” sama-sama dihitung dari data yang sama.',
          'Gabung ke rumah tangga cukup lewat link undangan atau QR code. Kalau keluar, wallet yang cuma punyamu ikut pindah ke ruang pribadi, dan yang dipakai bareng tetap di keluarga. Pakai Saku sendirian juga jalan dengan cara yang sama: rumah tangga isi satu orang, dan nggak ada fitur yang nungguin pasangan.',
        ],
      },
      {
        title: 'Real time tanpa server sendiri',
        paragraphs: [
          'Pas Ani nyimpen pengeluaran di HP-nya, laptop Budi langsung nampilin sesaat kemudian, tanpa server buatanku di tengahnya. Trigger Postgres nge-broadcast pesan kecil `{ table, op, by }` di channel Supabase Realtime milik rumah tangga itu. Tiap aplikasi dengerin dan cuma nge-refresh cache TanStack Query yang diisi tabel itu.',
          'Layar si penulis juga nggak nunggu bolak-balik ke server: tiap perubahan langsung tampil secara optimistic, dan kalau gagal, dibalikin lagi.',
        ],
        images: [
          shot(sync, 'Pengeluaran yang disimpan di HP muncul di laptop'),
        ],
      },
      {
        title: 'Aturan uang cuma ada di satu tempat',
        paragraphs: [
          'Dua aplikasi yang ngitung saldo dengan caranya masing-masing, cepat atau lambat bakal beda hasil. Jadi web dan HP nggak nyimpen aturan uang sendiri. Dua-duanya import satu package TypeScript bareng yang isinya schema Zod dan pembentuk baris buat semua yang mereka tulis. Beberapa aturan di dalamnya:',
        ],
        list: [
          '**Kartu kredit ditagih per siklus.** Tagihan tutup di tanggal cetak dan jatuh tempo di tanggal lain, dua-duanya disesuaikan buat bulan yang pendek. Aplikasinya misahin yang masih ditagih di lembar tagihan dari yang dibelanjain setelah tanggal cetak, dihitung pakai hari lokal user, bukan di SQL, karena di sana `current_date` itu UTC dan bakal bilang masih kemarin selama tujuh jam pertama tiap hari di Jakarta.',
          '**Emas disimpan dalam gram.** Nilai rupiahnya ngikutin snapshot harga harian, dan tiap wallet emas bisa pakai harga toko emasnya sendiri.',
          '**Riwayat tetap jujur.** Wallet bisa ganti dari dompet harian ke tabungan dan balik lagi. Tiap transaksi lama dinilai dari status wallet-nya di tanggal itu, jadi ganti status wallet nggak diam-diam ngubah angka bulan lalu.',
        ],
        images: [
          shot(money, 'Input cepat dan tagihan kartu kredit per siklus'),
        ],
      },
      {
        title: 'Bahasa Indonesia dan Inggris',
        paragraphs: [
          'Seluruh aplikasinya jalan dalam dua bahasa, di web maupun di HP, dan tiap anggota keluarga bisa pilih sendiri. Dua aplikasinya ngambil tiap kata dari sepasang file locale yang sama, dan ada test yang gagal kalau sebuah key cuma ada di satu bahasa atau cuma dipakai di satu aplikasi.',
        ],
        images: [shot(goals, 'Target tabungan di web dan di HP')],
      },
      {
        title: 'Rilis ke keluarga tanpa biaya',
        paragraphs: [
          'Aplikasinya harus tetap gratis, buat dibikin maupun dipakai: nggak ada layanan push berbayar dan nggak ada biaya store.',
        ],
        list: [
          '**Android di-install dari web-nya.** APK-nya ada di satu alamat tetap, dan tombol download serta QR code di web selalu ngarah ke situ.',
          '**Kebanyakan perbaikan dikirim over the air** pakai EAS Update, jadi nggak ada yang perlu install ulang. Cuma perubahan native yang butuh APK baru.',
          '**Pengingatnya pakai notifikasi lokal**, bukan push berbayar.',
        ],
      },
      {
        title: 'Biar terasa punya sendiri',
        paragraphs: [
          'Ada sembilan warna aksen dan sembilan belas background, dari warna polos sampai batik, plus foto sendiri, semuanya didefinisikan sekali di package bareng. Aksennya pakai OKLCH dan dites kontrasnya, dan warna yang punya arti buat uang (hijau pemasukan, merah pengeluaran) nggak pernah berubah. Background foto dikasih lapisan gelap yang dites biar judul tetap di 4.5:1 atau lebih di atas gambar apa pun.',
        ],
        images: [
          shot(themes, 'Tema gelap dan terang dengan warna aksen berbeda'),
          shot(web, 'Dashboard web dengan tema terang'),
        ],
      },
      {
        title: 'Trade-off',
        paragraphs: [],
        list: [
          '**Nggak ada import dari bank.** Tiap transaksi dicatat manual. Kredensial bank jadi nggak pernah masuk ke aplikasi, gantinya ya ngetik sedikit.',
          '**Belum ada di store.** Android di-install sebagai APK dari web-nya dan versi iPhone di-install lokal. Cukup buat keluarga, tapi belum rilis publik.',
        ],
      },
      {
        title: 'Dalam angka',
        paragraphs: [],
        list: [
          'Sekitar 1.000 commit sejak Juli 2026',
          '64 migration database',
          '520+ unit test mobile, plus suite Vitest buat package bareng dan web, dan satu smoke test Playwright buat auth guard',
        ],
      },
      {
        title: 'Rencana ke depan',
        paragraphs: ['Beberapa yang lagi aku jajaki, belum janji:'],
        list: [
          '**Nyatet lewat chat.** Orang tua yang ogah install aplikasi bisa nyatet pengeluaran dari WhatsApp pakai bahasa sehari-hari, dan ada konfirmasi dulu sebelum disimpan.',
          '**Tanya ke asisten AI sendiri.** Sambungin Saku ke asisten kayak Claude, terus tanya “bulan ini kita habis berapa buat makan?”',
          '**Investasi.** Reksadana, saham, dan deposito, di samping wallet dan emas yang udah ada.',
          '**Offline buat semuanya.** Transaksi baru udah bisa disimpan tanpa sinyal. Berikutnya edit, budget, dan target tabungan, setelah ada aturan yang jelas kalau dua orang ngubah data yang sama pas salah satunya lagi offline.',
          '**Scan struk** jadi rincian per item.',
          '**Rilis di Play Store dan App Store.**',
        ],
      },
    ],
    watch: 'Lihat videonya',
    open: 'Buka Saku',
    apps: 'Android: download APK-nya dari web · Play Store & App Store: segera hadir',
    video: 'Video promo Saku',
    next: 'Studi kasus berikutnya: pembuat CV yang nggak butuh server',
    back: 'Balik ke portfolio',
  }
);

const SakuCaseStudy = () => {
  const { lang } = useLang();
  const t = T[lang];
  const video = useRef<HTMLVideoElement>(null);

  const watch = () => {
    video.current?.scrollIntoView({ block: 'center' });
    // a click counts as a user gesture, so playing with sound is allowed
    video.current?.play().catch(() => {});
  };

  return (
    <CaseStudyArticle
      t={t}
      nextHref={CASE_STUDY.resumeBuilder}
      actions={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button onClick={watch}>
              <RiPlayFill /> {t.watch}
            </Button>
            <a
              href={WEB}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline' })}
            >
              {t.open} <RiExternalLinkLine />
            </a>
          </div>
          <p className="text-muted-foreground text-sm">{t.apps}</p>
        </div>
      }
    >
      <video
        ref={video}
        src={VIDEO}
        poster={poster}
        controls
        playsInline
        preload="none"
        aria-label={t.video}
        width={1280}
        height={720}
        className="aspect-video w-full rounded-md border bg-black"
      />
    </CaseStudyArticle>
  );
};

export default SakuCaseStudy;
