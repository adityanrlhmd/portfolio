import { RiExternalLinkLine } from '@remixicon/react';

import cuantv from '@/assets/projects/cuantv.webp';
import edotChat from '@/assets/projects/edot-chat.webp';
import edotLP from '@/assets/projects/edot-landing-page.webp';
import emitra from '@/assets/projects/emitra.webp';
import esuite from '@/assets/projects/esuite.webp';
import ework from '@/assets/projects/ework.webp';
import hodler from '@/assets/projects/hodler.webp';
import leslar from '@/assets/projects/leslar.webp';
import phantom from '@/assets/projects/phantom.webp';
import prestige from '@/assets/projects/prestige.webp';
import qsr from '@/assets/projects/qsr.webp';
import resumeBuilder from '@/assets/projects/resume-builder.jpg';
import rooma from '@/assets/projects/rooma.webp';

import { useLang } from '@/components/language-provider';
import { ShinyText } from '@/components/shiny-text';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { CASE_STUDY, SKILLS } from '@/lib/config';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// stacks render in the same group order as SKILLS in config
const SKILL_ORDER = Object.values(SKILLS);

const PROJECTS = [
  {
    title: 'Resume Builder',
    alter: { en: 'Free Job Search Tool', id: 'Tool Cari Kerja Gratis' },
    category: 'Web',
    image: resumeBuilder,
    imageSize: [1180, 868],
    description: {
      en: 'A free resume builder for job seekers, with a live PDF preview and nothing uploaded anywhere. The PDF you download carries the form data inside it, so importing it later fills the form back in: no account, no server. The PDF library loads only on the tool pages, so the portfolio stays light.',
      id: 'Pembuat CV gratis buat yang lagi cari kerja, dengan preview PDF live dan nggak ada data yang di-upload ke mana pun. PDF yang di-download nyimpen isi form di dalamnya, jadi tinggal import lagi buat lanjut edit: tanpa akun, tanpa server. Library PDF-nya cuma dimuat di halaman tools, jadi portfolio-nya tetap ringan.',
    },
    link: '/tools/resume',
    caseStudy: CASE_STUDY.href,
    stacks: [
      SKILLS['react-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.zod,
      SKILLS['react-pdf'],
      SKILLS.vitest,
      SKILLS['testing-library'],
      SKILLS.vite,
      SKILLS.vercel,
      SKILLS.git,
    ],
  },
  {
    title: 'emitra',
    alter: { en: 'B2B Marketplace', id: 'Marketplace B2B' },
    category: 'Web',
    image: emitra,
    imageSize: [1600, 915],
    img_padding: true,
    description: {
      en: 'A B2B marketplace where suppliers and large businesses order plant-based products in bulk and track each order live. The single Next.js app kept hitting conflicts on almost every merge request, so I helped split it into micro frontends in Turborepo, giving each part a cleaner home of its own. Zustand for light state, TanStack Query for API calls.',
      id: 'Marketplace B2B tempat supplier dan bisnis besar pesan produk nabati dalam jumlah besar dan pantau tiap pesanan secara live. Aplikasi Next.js-nya yang cuma satu itu hampir selalu konflik di tiap merge request, jadi aku ikut mecah jadi micro frontend di Turborepo, biar tiap bagian punya rumah sendiri yang lebih rapi. Zustand buat state ringan, TanStack Query buat API call.',
    },
    link: 'https://edot.id/en/products/emitra',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS.zustand,
      SKILLS.jest,
      SKILLS.vitest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.turborepo,
      SKILLS.git,
    ],
  },
  {
    title: 'esuite',
    alter: {
      en: 'Distribution Management System',
      id: 'Sistem Manajemen Distribusi',
    },
    category: 'Web',
    image: esuite,
    imageSize: [1076, 608],
    img_padding: true,
    description: {
      en: 'Puts sales, purchasing, inventory, and finance in one place for distributors, so stock and orders stop living in spreadsheets and manual notes. I built the UI with Next.js and shadcn/ui, used TanStack Query and Firebase for live data, and covered the important flows with tests.',
      id: 'Nyatuin penjualan, pembelian, inventaris, dan keuangan di satu tempat buat distributor, jadi stok dan pesanan nggak lagi tercecer di spreadsheet dan catatan manual. Aku bangun UI-nya pakai Next.js dan shadcn/ui, TanStack Query dan Firebase buat data live, dan alur-alur pentingnya ditutup pakai test.',
    },
    link: 'https://edot.id/en/products/esuite',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS.jest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.git,
    ],
  },
  {
    title: 'ework',
    alter: { en: 'Sales Force Automation', id: 'Sales Force Automation' },
    category: 'Web',
    image: ework,
    imageSize: [1056, 601],
    img_padding: true,
    description: {
      en: "Gives sales managers a live view of their field team: where they are, which stores they've visited, and what orders came in. I added real-time updates with Socket.io and visit routes and locations with the Google Maps API, on top of Next.js and Tailwind CSS.",
      id: 'Kasih manajer sales pantauan live soal tim lapangannya: lagi di mana, toko mana yang udah dikunjungi, dan pesanan apa yang masuk. Aku nambahin update real-time pakai Socket.io, plus rute kunjungan dan lokasi pakai Google Maps API, di atas Next.js dan Tailwind CSS.',
    },
    link: 'https://edot.id/en/products/ework',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS['socket-io'],
      SKILLS['google-maps'],
      SKILLS.jest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.git,
    ],
  },
  {
    title: 'QSR (Quick Service Restaurant) POS System',
    alter: { en: 'Restaurant POS', id: 'POS Restoran' },
    category: 'Web',
    image: qsr,
    imageSize: [974, 550],
    img_padding: true,
    description: {
      en: 'A cashier system for busy restaurants, where every second at checkout counts during rush hour. I worked on the transaction logic in Next.js inside Turborepo, using TanStack Query to keep it quick and responsive.',
      id: 'Sistem kasir buat restoran yang ramai, di mana tiap detik di kasir berharga pas jam sibuk. Aku ngerjain logika transaksinya di Next.js dalam Turborepo, pakai TanStack Query biar tetap cepat dan responsif.',
    },
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS.zustand,
      SKILLS.vitest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.turborepo,
      SKILLS.git,
    ],
  },
  {
    title: 'eDOT Chat (Desktop)',
    alter: { en: 'Company Platform', id: 'Platform Perusahaan' },
    category: 'Web',
    image: edotChat,
    imageSize: [1176, 576],
    img_padding: true,
    description: {
      en: 'An internal chat app, so companies can keep work conversations in their own tool. Socket.io keeps messages in sync, IndexedDB stores chats locally, and TanStack Query handles caching, so even long histories open quickly.',
      id: 'Aplikasi chat internal, biar perusahaan bisa nyimpen obrolan kerja di tool mereka sendiri. Socket.io jaga pesan tetap sinkron, IndexedDB nyimpen chat secara lokal, dan TanStack Query ngurus caching, jadi riwayat yang panjang pun kebuka cepat.',
    },
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS['socket-io'],
      SKILLS['indexed-db'],
      SKILLS.git,
    ],
  },
  {
    title: 'eDOT Landing Page',
    alter: { en: 'Company Profile', id: 'Company Profile' },
    category: 'Web',
    image: edotLP,
    imageSize: [1600, 915],
    img_padding: true,
    description: {
      en: 'The eDOT company site, where marketing needed to publish and tune content for search without waiting on developers. I connected it to Directus as a headless CMS so the SEO team can do that on their own, with Next.js keeping pages fast.',
      id: 'Situs perusahaan eDOT, tempat tim marketing perlu publish dan ngoptimasi konten buat mesin pencari tanpa nunggu developer. Aku nyambungin ke Directus sebagai headless CMS biar tim SEO bisa ngerjain sendiri, dengan Next.js yang jaga halamannya tetap cepat.',
    },
    link: 'https://edot.id/en',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.directus,
      SKILLS.tanstack,
      SKILLS.jest,
      SKILLS['testing-library'],
      SKILLS.git,
    ],
  },
  {
    title: 'Prestige Promotions',
    alter: { en: 'Company Profile', id: 'Company Profile' },
    category: 'Web',
    image: prestige,
    imageSize: [1600, 965],
    description: {
      en: 'A site for an event promoter to show off their events and keep them up to date without calling a developer. Built with Next.js and Framer Motion, with Directus as a headless CMS so the team can update content themselves.',
      id: 'Situs buat promotor event supaya bisa pamer event-nya dan terus update tanpa harus ngehubungin developer. Dibangun pakai Next.js dan Framer Motion, dengan Directus sebagai headless CMS biar timnya bisa ubah konten sendiri.',
    },
    link: 'https://prestigepromotions.id',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['framer-motion'],
      SKILLS.typescript,
      SKILLS.directus,
      SKILLS.zustand,
      SKILLS.git,
    ],
  },
  {
    title: 'Phantom',
    alter: { en: 'Booking App', id: 'Aplikasi Reservasi' },
    category: 'Web',
    image: phantom,
    imageSize: [1600, 965],
    description: {
      en: 'Lets guests book at nightlife and entertainment venues online, so reservations no longer go through back-and-forth chats. Zustand for state, Supabase for the real-time database and auth, and Ant Design for the UI.',
      id: 'Tamu bisa booking tempat di venue hiburan malam secara online, jadi reservasi nggak lagi lewat chat bolak-balik. Zustand buat state, Supabase buat database real-time dan auth, dan Ant Design buat UI.',
    },
    link: 'https://phantomclub.id',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['ant-design'],
      SKILLS.zustand,
      SKILLS.supabase,
      SKILLS.git,
    ],
  },
  {
    title: 'Hodler',
    alter: { en: 'Crypto Website', id: 'Website Kripto' },
    category: 'Web',
    image: hodler,
    imageSize: [1600, 965],
    description: {
      en: 'The front door for a crypto community project: it explains the token and points new holders to where they can buy and join the community. Built with Next.js and TypeScript, kept light so it loads fast.',
      id: 'Pintu depan buat proyek komunitas kripto: jelasin token-nya dan ngarahin holder baru ke tempat beli dan gabung komunitas. Dibangun pakai Next.js dan TypeScript, sengaja dibikin ringan biar cepat kebuka.',
    },
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS.typescript,
      SKILLS.zustand,
      SKILLS.git,
    ],
  },
  {
    title: 'Rooma',
    alter: {
      en: 'Interior Design Reservations',
      id: 'Reservasi Desain Interior',
    },
    category: 'Web',
    image: rooma,
    imageSize: [1600, 965],
    description: {
      en: 'Connects clients with interior designers, so booking a consultation takes a few clicks instead of a long back-and-forth. Supabase handles users and reservations, with a responsive Next.js frontend on top.',
      id: 'Nyambungin klien sama desainer interior, jadi pesan konsultasi cukup beberapa klik, nggak perlu chat bolak-balik yang panjang. Supabase ngurus user dan reservasi, dengan frontend Next.js yang responsif di atasnya.',
    },
    link: 'https://rooma.co.id',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS.supabase,
      SKILLS.zustand,
      SKILLS.git,
    ],
  },
  {
    title: 'Cuan TV',
    alter: { en: 'Web3 Video Platform', id: 'Platform Video Web3' },
    category: 'Mobile',
    image: cuantv,
    imageSize: [1600, 965],
    description: {
      en: "Brings the project's video content and Web3 assets together in one mobile app, so users don't need a separate wallet site. Built with React Native for Android and iOS, using Moralis and Web3 for the blockchain side.",
      id: 'Nyatuin konten video dan aset Web3 proyeknya dalam satu aplikasi mobile, jadi user nggak perlu situs wallet terpisah. Dibangun pakai React Native buat Android dan iOS, dengan Moralis dan Web3 buat sisi blockchain-nya.',
    },
    link: 'https://play.google.com/store/apps/details?id=com.leslarmetaverse.cuantv&pli=1',
    stacks: [
      SKILLS['react-native'],
      SKILLS.expo,
      SKILLS.moralis,
      SKILLS.web3,
      SKILLS.git,
    ],
  },
  {
    title: 'Leslar Metaverse',
    alter: { en: 'Blockchain Website', id: 'Website Blockchain' },
    category: 'Web',
    image: leslar,
    imageSize: [1600, 965],
    description: {
      en: 'The main entry point into a blockchain project, where users go from reading about it to actually using it. I used Web3 and Moralis to connect the smart contracts to the UI.',
      id: 'Pintu masuk utama ke proyek blockchain, tempat user beralih dari sekadar baca-baca jadi beneran pakai. Aku pakai Web3 dan Moralis buat nyambungin smart contract ke UI.',
    },
    link: 'https://www.leslarmetaverse.com',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS.moralis,
      SKILLS.web3,
      SKILLS.git,
    ],
  },
];

const T = translations(
  {
    eyebrow: '⚡︎ Selected Works',
    title: 'Projects',
    intro:
      "Some of the things I've worked on, from enterprise platforms to client sites, and what I handled on each.",
    newTab: 'opens in a new tab',
    caseStudy: 'Read the case study →',
  },
  {
    eyebrow: '⚡︎ Karya Pilihan',
    title: 'Proyek',
    intro:
      'Beberapa yang pernah kukerjain, dari platform enterprise sampai situs klien, plus bagian apa yang kupegang di tiap proyek.',
    newTab: 'buka di tab baru',
    caseStudy: 'Baca studi kasusnya →',
  }
);

const Projects = () => {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section
      id="projects"
      className="border-b py-16 sm:scroll-mt-(--header-height)"
    >
      <div className="container space-y-10">
        <div className="max-w-3xl space-y-4">
          <ShinyText
            text={t.eyebrow}
            speed={2}
            delay={0}
            color="var(--primary)"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="text-primary font-bold"
          />
          <h2 className="text-4xl font-bold lg:text-5xl lg:leading-tight">
            {t.title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {t.intro}
          </p>
        </div>

        <div className="group/grid grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <Card
              key={index}
              className="group/card hover:border-primary border-b ring-0 transition-opacity lg:group-has-[*:hover]/grid:opacity-40 lg:hover:opacity-100"
            >
              <div
                className={cn(
                  'relative overflow-hidden',
                  project.img_padding && 'py-4'
                )}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  width={project.imageSize[0]}
                  height={project.imageSize[1]}
                  loading="lazy"
                  decoding="async"
                  className="relative w-full object-cover transition-transform lg:group-hover/card:scale-105"
                />
              </div>

              <CardHeader>
                <CardTitle>
                  <h3>{project.title}</h3>
                </CardTitle>
                <CardDescription>
                  <p>{project.alter[lang]}</p>
                </CardDescription>
                <CardAction>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} (${project.category}, ${t.newTab})`}
                      className="hover:text-primary flex items-center gap-2 text-xs"
                    >
                      {project.category}
                      <RiExternalLinkLine size={20} />
                    </a>
                  ) : (
                    <span className="text-xs">{project.category}</span>
                  )}
                </CardAction>
              </CardHeader>

              <CardContent className="text-muted-foreground space-y-3">
                <p>{project.description[lang]}</p>
                {project.caseStudy && (
                  <a
                    href={project.caseStudy}
                    className="text-primary inline-block font-medium hover:underline"
                  >
                    {t.caseStudy}
                  </a>
                )}
              </CardContent>

              <CardFooter>
                <ul className="flex flex-wrap gap-2">
                  {[...project.stacks]
                    .sort(
                      (a, b) => SKILL_ORDER.indexOf(a) - SKILL_ORDER.indexOf(b)
                    )
                    .map((stack, index) => (
                      <li key={index}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="border p-2">
                              <img
                                src={stack.icon}
                                alt={stack.name}
                                loading="lazy"
                                title={stack.name}
                                className={cn(
                                  'size-4 object-contain sm:size-6',
                                  stack.inverted && 'dark:invert'
                                )}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{stack.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    ))}
                </ul>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
