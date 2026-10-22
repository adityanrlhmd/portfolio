import type { Resume } from './schema';

// Shared by the Experience section and the resume builder's default data.
// location and description only show up on the resume.
export const EXPERIENCES = [
  {
    id: 'govtech-procurement',
    company: 'GovTech Procurement',
    role: 'Frontend Engineer',
    duration: 'Jul 2026 - Present',
    location: 'Jakarta, Indonesia',
    description: '',
    jobdesc: [
      'Government E-Procurement Platform: Building features across several apps in a large Next.js, React, and TypeScript monorepo (Turborepo) for a national procurement platform.',
      'Order & Contract Flows: Own the order and contract flows end to end, from order review and contract approval to amendments with before/after previews and payment schedule changes.',
      'Legacy Migration: Moved key flows from the old app to the new one, reusing shared modules so everything still behaves the same.',
      'Contract PDFs: Generate official, print-ready contract documents with React PDF, sorting out page breaks, long text, and font coverage along the way.',
      'Typed Data Layer: Work with GraphQL APIs using typed codegen, TanStack Query, and Zod-validated forms, together with the backend, QA, and product teams.',
      'Code Reviews & Quality: Review PRs to make sure both the code and the business logic hold up, keep CI checks (typecheck, lint, build) green, and push for shared UI components over one-off styling.',
    ],
  },
  {
    id: 'bank-jakarta',
    company: 'Bank Jakarta',
    role: 'Frontend Engineer',
    duration: 'Jun 2026 - Jul 2026',
    location: 'Jakarta, Indonesia',
    description: '',
    jobdesc: [
      'Core Banking Features: Built Branch Delivery System (BDS) modules so tellers can handle cash deposits, withdrawals, and internal/external transfers.',
      "Project Setup: Set up the frontend project from scratch, following the bank's development guidelines.",
      "UI Implementation: Turned Figma designs into working screens by customizing Ant Design components to fit the bank's design system.",
      'Multi-Transaction Flow: Designed the state flow that lets a teller run several transactions at once in a single session.',
      'Performance & Maintainability: Used code-splitting to keep the bundle small and pages quick to load, and kept the code easy to work on.',
    ],
  },
  {
    id: 'edot',
    company: 'PT. Elektronik Distribusi Otomatisasi Terkemuka (eDOT)',
    role: 'Frontend Engineer',
    duration: 'Jan 2024 - May 2026',
    location: 'Bandung, Indonesia (Remote)',
    description:
      'A business partner offering integrated technology and marketing solutions.',
    jobdesc: [
      'Micro Frontends: Built and maintained apps on a micro frontend setup, so each team could work on and ship its part without stepping on the others.',
      "Architecture Discussions: Talked through architecture options with the team, weighing what fits and what doesn't before we committed to one.",
      "Onboarding: Walked new teammates through how the codebase is structured, why it's set up that way, and how new features should fit in.",
      'Landing Page & Headless CMS: Built the company landing page on a headless CMS, so the SEO team could update content on their own without hurting search visibility.',
      'Document Management System: Built the DMS module, covering file handling, versioning, and rendering large amounts of data smoothly.',
      'Real-time Chat: Built the real-time chat, keeping messages and state in sync for everyone in the conversation.',
      'Testing & Performance: Wrote unit and integration tests to catch bugs before production, and used code-splitting and lazy loading to keep things fast.',
    ],
  },
  {
    id: 'kodx',
    company: 'KodX',
    role: 'Software Engineer',
    duration: 'Apr 2023 - Dec 2023',
    location: 'Jakarta, Indonesia (Remote)',
    description:
      'The company creates cutting-edge web and mobile apps to optimize business operations and enhance user experiences.',
    jobdesc: [
      'Built web and mobile interfaces with React, Next.js, Vue.js, React Native, and Tailwind CSS.',
      'Developed Node.js services for data processing and integration with databases and third-party APIs.',
      'Used Supabase for data storage, real-time updates, and user authentication.',
      'Shipped cross-platform mobile apps with React Native (Expo) and native iOS apps with Swift and SwiftUI.',
      'Crafted smooth animations and transitions with Framer Motion.',
      'Improved performance through caching and reducing redundant network requests.',
    ],
  },
  {
    id: 'leslar',
    company: 'LESLAR Metaverse',
    role: 'Frontend Engineer',
    duration: 'Aug 2022 - Mar 2023',
    location: 'Jakarta Utara, Indonesia',
    description: 'Engaged in blockchain services.',
    jobdesc: [
      'Built web and mobile interfaces with React, Next.js, and React Native (Expo).',
      'Integrated Moralis and Web3 for blockchain interactions and dApp features.',
      'Designed GraphQL schemas, queries, and mutations backed by Node.js services.',
      'Worked closely with designers to keep UI/UX consistent across web and mobile.',
    ],
  },
  {
    id: 'trees-studio',
    company: 'Trees Studio',
    role: 'Web Developer',
    duration: 'Sep 2021 - Aug 2022',
    location: 'Sukabumi, Indonesia',
    description: '',
    jobdesc: [
      'Delivered full-stack website projects as part of a cross-functional team.',
      'Built responsive, user-friendly web apps with React and Next.js.',
      'Collaborated with designers and engineers from design handoff to release.',
    ],
  },
  {
    id: 'omindtech',
    company: 'OmindTech',
    role: 'Frontend Engineer (Internship)',
    duration: 'Apr 2021 - Nov 2021',
    location: 'Depok, Indonesia',
    description: 'Software House and IT Consultant',
    jobdesc: [
      'Designed and built the company profile landing page for the agency.',
      'Developed mobile-first, responsive layouts with Vue.js, Bootstrap, and Sass.',
      'Shipped UI improvements to enhance the overall user experience.',
    ],
  },
];

export const ADITYA_RESUME: Resume = {
  name: 'Aditya Nurul Hamda',
  phone: '+6285961082180',
  email: 'aditya.nrlhamda@gmail.com',
  location: 'Sukabumi, West Java, Indonesia',
  links: 'linkedin.com/in/adityanurulhamda/\nhttps://adityahamda.vercel.app/',
  summary:
    'Frontend Engineer with extensive experience in scalable web and mobile technologies, specializing in React, Next.js, and React Native with additional proficiency in Vue. I have a proven track record of building complex, enterprise-grade systems such as Enterprise Resource Planning (ERP), Document Management Systems (DMS), real-time chat applications, and Micro Frontend architectures. My strengths lie in implementing Clean Architecture and seamless API integrations to deliver scalable solutions. By leveraging an AI-assisted workflow, I consistently achieve high productivity and ensure rapid delivery without compromising code quality.',
  photo: '',
  skills: [
    'Programming Language: JavaScript (ES6+), TypeScript, HTML5, CSS3, Swift.',
    'Web Frameworks & Libraries: React, Next.js, Vue.js, Tailwind CSS, Antd.',
    'Mobile Development: React Native, Expo, SwiftUI.',
    'Architecture & Testing: Micro Frontend Architecture, Clean Architecture, Unit Testing, Integration Testing.',
    'Data & State Management: GraphQL, Apollo Client, REST API, Supabase, Redux/Zustand.',
    'Specialized Tech & Tools: Web3 (Moralis, Web3.js), Framer Motion (Animations), AI-Assisted Coding (TRAE/AntiGravity), Node.js, Git.',
  ].join('\n'),
  experiences: EXPERIENCES.map(exp => ({
    company: exp.company,
    location: exp.location,
    duration: exp.duration,
    role: exp.role,
    description: exp.description,
    bullets: exp.jobdesc.join('\n'),
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
