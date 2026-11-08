import type { Resume } from './resume/schema';

// Aditya's own data: the Experience section, the hero's CV, and both tools' "Fill with Aditya's data".
// location and description only show up on the resume, which stays in English.
export const EXPERIENCES = [
  {
    id: 'govtech-procurement',
    company: 'GovTech Procurement',
    role: 'Frontend Engineer',
    duration: { en: 'Jul 2026 - Present', id: 'Jul 2026 - Sekarang' },
    location: 'Jakarta, Indonesia (Hybrid)',
    description:
      'Government e-procurement platform for a national procurement agency.',
    jobdesc: {
      en: [
        'Build features across several apps in a large Next.js, React, and TypeScript monorepo (Turborepo), including moving key flows from the legacy app onto shared modules.',
        'Own the order and contract flows end to end, from review and approval to amendments.',
        'Generate official, print-ready contract PDFs with React PDF, handling page breaks, long text, and font coverage.',
        'Work with typed GraphQL APIs (codegen), TanStack Query, and Zod-validated forms alongside the backend, QA, and product teams.',
        'Review PRs for both code and business logic, keep CI checks (typecheck, lint, build) green, and push for shared UI components over one-off styling.',
      ],
      id: [
        'Bangun fitur di beberapa aplikasi dalam monorepo Next.js, React, dan TypeScript yang besar (Turborepo), termasuk mindahin alur-alur utama dari aplikasi lama ke modul bersama.',
        'Pegang alur pesanan dan kontrak dari ujung ke ujung, mulai dari review dan approval sampai adendum.',
        'Bikin PDF kontrak resmi yang siap cetak pakai React PDF, termasuk ngurusin page break, teks panjang, dan dukungan font.',
        'Kerja bareng tim backend, QA, dan produk pakai GraphQL API yang typed (codegen), TanStack Query, dan form yang divalidasi Zod.',
        'Review PR dari sisi kode dan logika bisnis, jaga CI (typecheck, lint, build) tetap hijau, dan dorong pemakaian komponen UI bersama daripada styling sekali pakai.',
      ],
    },
  },
  {
    id: 'bank-jakarta',
    company: 'Bank Jakarta',
    role: 'Frontend Engineer',
    duration: { en: 'Jun 2026 - Jul 2026', id: 'Jun 2026 - Jul 2026' },
    location: 'Jakarta, Indonesia',
    description: 'Regional bank.',
    jobdesc: {
      en: [
        'Built Branch Delivery System (BDS) modules that let tellers handle cash deposits, withdrawals, and internal/external transfers.',
        "Set up the frontend project from scratch, following the bank's development guidelines.",
        'Designed the state flow that lets a teller run several transactions in a single session.',
        'Turned Figma designs into screens with customized Ant Design components, and used code-splitting to keep pages fast.',
      ],
      id: [
        'Bangun modul Branch Delivery System (BDS) yang dipakai teller buat setor tunai, tarik tunai, dan transfer internal maupun eksternal.',
        'Setup proyek frontend dari nol, ngikutin pedoman development dari bank.',
        'Rancang alur state biar teller bisa jalanin beberapa transaksi dalam satu sesi.',
        'Ubah desain Figma jadi layar pakai komponen Ant Design yang dikustom, plus code-splitting biar halamannya tetap cepat.',
      ],
    },
  },
  {
    id: 'edot',
    company: 'eDOT (PT Elektronik Distribusi Otomatisasi Terkemuka)',
    role: 'Frontend Engineer',
    duration: { en: 'Jan 2024 - May 2026', id: 'Jan 2024 - Mei 2026' },
    location: 'Bandung, Indonesia (Remote)',
    description: 'Technology and marketing solutions company.',
    jobdesc: {
      en: [
        'Built and maintained apps on a micro frontend architecture, so each team could ship its part independently.',
        'Developed the document management system (file handling, versioning, smooth rendering of large data sets) and the real-time chat.',
        'Delivered the company landing page on a headless CMS, so the SEO team could update content without developers.',
        'Wrote unit and integration tests, and used code-splitting and lazy loading to keep apps fast.',
        'Mentored new engineers on the codebase and helped drive architecture decisions.',
      ],
      id: [
        'Bangun dan maintain aplikasi di arsitektur micro frontend, jadi tiap tim bisa rilis bagiannya sendiri-sendiri.',
        'Develop sistem manajemen dokumen (file handling, versioning, render data besar yang tetap mulus) dan chat real-time.',
        'Rilis landing page perusahaan di atas headless CMS, jadi tim SEO bisa update konten tanpa nunggu developer.',
        'Nulis unit test dan integration test, plus code-splitting dan lazy loading biar aplikasi tetap cepat.',
        'Mentoring engineer baru soal codebase dan ikut nentuin keputusan arsitektur.',
      ],
    },
  },
  {
    id: 'kodx',
    company: 'KodX',
    role: 'Software Engineer',
    duration: { en: 'Apr 2023 - Dec 2023', id: 'Apr 2023 - Des 2023' },
    location: 'Jakarta, Indonesia (Remote)',
    description: 'Software house building web and mobile apps.',
    jobdesc: {
      en: [
        'Built web and mobile interfaces with React, Next.js, Vue.js, React Native, and Tailwind CSS, with animations in Framer Motion.',
        'Shipped cross-platform apps with React Native (Expo) and native iOS apps with Swift and SwiftUI.',
        'Developed Node.js services and used Supabase for data storage, real-time updates, and authentication.',
        'Improved performance through caching and fewer redundant network requests.',
      ],
      id: [
        'Bangun tampilan web dan mobile pakai React, Next.js, Vue.js, React Native, dan Tailwind CSS, dengan animasi dari Framer Motion.',
        'Rilis aplikasi lintas platform pakai React Native (Expo) dan aplikasi iOS native pakai Swift dan SwiftUI.',
        'Develop service Node.js dan pakai Supabase buat simpan data, update real-time, dan autentikasi.',
        'Naikin performa lewat caching dan ngurangin request jaringan yang dobel.',
      ],
    },
  },
  {
    id: 'leslar',
    company: 'LESLAR Metaverse',
    role: 'Frontend Engineer',
    duration: { en: 'Aug 2022 - Mar 2023', id: 'Agu 2022 - Mar 2023' },
    location: 'Jakarta, Indonesia',
    description: 'Blockchain and Web3 company.',
    jobdesc: {
      en: [
        'Built web and mobile interfaces with React, Next.js, and React Native (Expo), working closely with designers to keep the UI consistent.',
        'Integrated Moralis and Web3 for blockchain interactions and dApp features.',
        'Designed GraphQL schemas, queries, and mutations backed by Node.js services.',
      ],
      id: [
        'Bangun tampilan web dan mobile pakai React, Next.js, dan React Native (Expo), kerja dekat sama desainer biar UI-nya tetap konsisten.',
        'Integrasi Moralis dan Web3 buat interaksi blockchain dan fitur dApp.',
        'Rancang schema, query, dan mutation GraphQL yang jalan di atas service Node.js.',
      ],
    },
  },
  {
    id: 'trees-studio',
    company: 'Trees Studio',
    role: 'Web Developer',
    duration: { en: 'Sep 2021 - Aug 2022', id: 'Sep 2021 - Agu 2022' },
    location: 'Sukabumi, Indonesia',
    description: 'Web development studio.',
    jobdesc: {
      en: [
        'Delivered full-stack website projects with React and Next.js as part of a cross-functional team.',
        'Collaborated with designers and engineers from design handoff to release.',
      ],
      id: [
        'Ngerjain proyek website full-stack pakai React dan Next.js bareng tim lintas fungsi.',
        'Kolaborasi sama desainer dan engineer dari handoff desain sampai rilis.',
      ],
    },
  },
  {
    id: 'omindtech',
    company: 'OmindTech',
    role: 'Frontend Engineer (Internship)',
    duration: { en: 'Apr 2021 - Nov 2021', id: 'Apr 2021 - Nov 2021' },
    location: 'Depok, Indonesia',
    description: 'Software house and IT consultant.',
    jobdesc: {
      en: [
        "Designed and built the agency's company profile landing page.",
        'Developed mobile-first, responsive layouts with Vue.js, Bootstrap, and Sass.',
      ],
      id: [
        'Rancang dan bangun landing page company profile milik agensi.',
        'Develop layout responsif yang mobile-first pakai Vue.js, Bootstrap, dan Sass.',
      ],
    },
  },
];

export const ADITYA_RESUME: Resume = {
  name: 'Aditya Nurul Hamda',
  phone: '+62 859 6108 2180',
  email: 'aditya.nrlhamda@gmail.com',
  location: 'Sukabumi, Indonesia (Open to Remote/Relocation)',
  links: 'linkedin.com/in/adityanurulhamda\nadityahamda.vercel.app',
  summary:
    'Frontend Engineer with 5+ years building web and mobile apps with React, Next.js, and React Native, from government procurement and core banking to enterprise platforms. Comfortable owning features end to end and keeping large codebases maintainable for the next engineer.',
  photo: '',
  skills: [
    'Languages: TypeScript, JavaScript (ES6+), HTML, CSS, Swift.',
    'Frontend: React, Next.js, Vue.js, Tailwind CSS, Ant Design, Framer Motion.',
    'Mobile: React Native (Expo), SwiftUI.',
    'Data & State: GraphQL, REST API, TanStack Query, Apollo Client, Redux, Zustand, Zod.',
    'Architecture & Testing: Monorepo (Turborepo), Micro Frontends, Unit & Integration Testing.',
    'Tools: Git, Node.js, Supabase, Web3 (Moralis), AI-Assisted Development.',
  ].join('\n'),
  achievements:
    'Front End JavaScript – Studi Independen Bersertifikat Kampus Merdeka, Binar Academy (2022)',
  experiences: EXPERIENCES.map(exp => ({
    company: exp.company,
    location: exp.location,
    duration: exp.duration.en,
    role: exp.role,
    description: exp.description,
    bullets: exp.jobdesc.en.join('\n'),
  })),
  educations: [
    {
      school: 'Universitas Nusa Putra',
      location: 'Sukabumi, Indonesia',
      duration: 'Aug 2018 - Sep 2022',
      degree: 'Bachelor of Computer Science',
    },
  ],
};
