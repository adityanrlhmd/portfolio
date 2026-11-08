import {
  RiBarChartHorizontalLine,
  RiCalculatorLine,
  RiFileSearchLine,
  RiFileUserLine,
  RiFolderLine,
  RiHomeLine,
  RiQuillPenLine,
  RiSendPlaneLine,
  RiToolsLine,
} from '@remixicon/react';

import antdesignIcon from '@/assets/skills/ant-design.svg';
import apolloIcon from '@/assets/skills/apollo.svg';
import cssIcon from '@/assets/skills/css.svg';
import directusIcon from '@/assets/skills/directus.svg';
import expoIcon from '@/assets/skills/expo.svg';
import expressIcon from '@/assets/skills/expressjs.svg';
import firebaseIcon from '@/assets/skills/firebase.svg';
import framermotionIcon from '@/assets/skills/framer-motion.svg';
import gitIcon from '@/assets/skills/git.svg';
import googlemapsIcon from '@/assets/skills/google-maps.svg';
import graphqlIcon from '@/assets/skills/graphql.svg';
import htmlIcon from '@/assets/skills/html.svg';
import indexeddbIcon from '@/assets/skills/indexed-db.svg';
import javascriptIcon from '@/assets/skills/javascript.svg';
import jestIcon from '@/assets/skills/jest.svg';
import mongodbIcon from '@/assets/skills/mongodb.svg';
import moralisIcon from '@/assets/skills/moralis.svg';
import mysqlIcon from '@/assets/skills/mysql.svg';
import nextjsIcon from '@/assets/skills/nextjs.svg';
import nodejsIcon from '@/assets/skills/nodejs.svg';
import reactpdfIcon from '@/assets/skills/react-pdf.svg';
import reactIcon from '@/assets/skills/react.svg';
import reduxIcon from '@/assets/skills/redux.svg';
import shadcnIcon from '@/assets/skills/shadcn-ui.svg';
import socketioIcon from '@/assets/skills/socket-io.svg';
import sonarqubeIcon from '@/assets/skills/sonarqube.svg';
import supabaseIcon from '@/assets/skills/supabase.svg';
import swiftIcon from '@/assets/skills/swift.svg';
import swiftuiIcon from '@/assets/skills/swiftui.svg';
import tailwindIcon from '@/assets/skills/tailwindcss.svg';
import tanstackIcon from '@/assets/skills/tanstack.svg';
import testinglibraryIcon from '@/assets/skills/testing-library.svg';
import turborepoIcon from '@/assets/skills/turborepo.svg';
import typescriptIcon from '@/assets/skills/typescript.svg';
import vercelIcon from '@/assets/skills/vercel.svg';
import viteIcon from '@/assets/skills/vite.svg';
import vitestIcon from '@/assets/skills/vitest.svg';
import vueIcon from '@/assets/skills/vue.svg';
import web3Icon from '@/assets/skills/web-3.svg';
import zodIcon from '@/assets/skills/zod.svg';
import zustandIcon from '@/assets/skills/zustand.svg';

export const SKILLS = {
  // Languages
  typescript: { name: 'TypeScript', icon: typescriptIcon, inverted: false },
  javascript: { name: 'JavaScript', icon: javascriptIcon, inverted: false },
  swift: { name: 'Swift', icon: swiftIcon, inverted: false },
  // Frameworks
  'react-js': { name: 'React.js', icon: reactIcon, inverted: false },
  'next-js': { name: 'Next.js', icon: nextjsIcon, inverted: false },
  'react-native': { name: 'React Native', icon: reactIcon, inverted: false },
  expo: { name: 'Expo', icon: expoIcon, inverted: false },
  'vue-js': { name: 'Vue.js', icon: vueIcon, inverted: false },
  swiftui: { name: 'SwiftUI', icon: swiftuiIcon, inverted: false },
  // State & data
  redux: { name: 'Redux', icon: reduxIcon, inverted: false },
  zustand: { name: 'Zustand', icon: zustandIcon, inverted: false },
  tanstack: { name: 'TanStack', icon: tanstackIcon, inverted: false },
  graphql: { name: 'GraphQL', icon: graphqlIcon, inverted: false },
  apollo: { name: 'Apollo Client', icon: apolloIcon, inverted: true },
  zod: { name: 'Zod', icon: zodIcon, inverted: false },
  'socket-io': { name: 'Socket.io', icon: socketioIcon, inverted: true },
  // UI & styling
  tailwindcss: { name: 'Tailwind CSS', icon: tailwindIcon, inverted: false },
  'shadcn-ui': { name: 'shadcn/ui', icon: shadcnIcon, inverted: true },
  'ant-design': { name: 'Ant Design', icon: antdesignIcon, inverted: false },
  'framer-motion': {
    name: 'Framer Motion',
    icon: framermotionIcon,
    inverted: false,
  },
  'react-pdf': { name: 'React PDF', icon: reactpdfIcon, inverted: false },
  'google-maps': { name: 'Google Maps', icon: googlemapsIcon, inverted: false },
  // Testing & quality
  vitest: { name: 'Vitest', icon: vitestIcon, inverted: false },
  jest: { name: 'Jest', icon: jestIcon, inverted: false },
  'testing-library': {
    name: 'Testing Library',
    icon: testinglibraryIcon,
    inverted: false,
  },
  sonarqube: { name: 'SonarQube', icon: sonarqubeIcon, inverted: false },
  // Backend & database
  'node-js': { name: 'Node.js', icon: nodejsIcon, inverted: false },
  'express-js': { name: 'Express.js', icon: expressIcon, inverted: false },
  supabase: { name: 'Supabase', icon: supabaseIcon, inverted: false },
  firebase: { name: 'Firebase', icon: firebaseIcon, inverted: false },
  mongodb: { name: 'MongoDB', icon: mongodbIcon, inverted: false },
  mysql: { name: 'MySQL', icon: mysqlIcon, inverted: false },
  directus: { name: 'Directus', icon: directusIcon, inverted: false },
  'indexed-db': { name: 'IndexedDB', icon: indexeddbIcon, inverted: true },
  // Web3
  web3: { name: 'Web3', icon: web3Icon, inverted: false },
  moralis: { name: 'Moralis', icon: moralisIcon, inverted: false },
  // Tooling & deploy
  git: { name: 'Git', icon: gitIcon, inverted: false },
  vite: { name: 'Vite', icon: viteIcon, inverted: false },
  turborepo: { name: 'Turborepo', icon: turborepoIcon, inverted: true },
  vercel: { name: 'Vercel', icon: vercelIcon, inverted: true },
  // Keep this skills in the last
  html: { name: 'HTML', icon: htmlIcon, inverted: false },
  css: { name: 'CSS', icon: cssIcon, inverted: false },
};

// titles in both languages, picked with the site language (see useLang)
export const NAVIGATIONS = [
  {
    title: { en: 'Home', id: 'Beranda' },
    href: '#home',
    icon: RiHomeLine,
  },
  {
    title: { en: 'Experience', id: 'Pengalaman' },
    href: '#experience',
    icon: RiBarChartHorizontalLine,
  },
  {
    title: { en: 'Projects', id: 'Proyek' },
    href: '#projects',
    icon: RiFolderLine,
  },
  {
    title: { en: 'Contact', id: 'Kontak' },
    href: '#contact',
    icon: RiSendPlaneLine,
  },
] as const;

// The free tools, each a page of its own under /tools (see App and vercel.json),
// in the order a job hunt uses them
export const TOOLS = [
  {
    title: { en: 'Resume Builder', id: 'Pembuat CV' },
    href: '/tools/resume',
    icon: RiFileUserLine,
    description: {
      en: 'Fill a form and watch your resume take shape as a PDF, ready to download.',
      id: 'Isi form, CV kamu langsung jadi PDF dan siap di-download.',
    },
  },
  {
    title: { en: 'Keyword Checker', id: 'Cek Kata Kunci' },
    href: '/tools/keyword-check',
    icon: RiFileSearchLine,
    description: {
      en: 'Paste a job post and see which skills it asks for that your resume leaves out.',
      id: 'Paste lowongan kerja, lihat skill apa aja yang diminta tapi belum ada di CV kamu.',
    },
  },
  {
    title: { en: 'Cover Letter', id: 'Surat Lamaran' },
    href: '/tools/cover-letter',
    icon: RiQuillPenLine,
    description: {
      en: 'Write a cover letter that matches your resume, with your details filled in.',
      id: 'Tulis surat lamaran yang nyambung sama CV kamu, data diri udah keisi otomatis.',
    },
  },
  {
    title: { en: 'Salary Calculator', id: 'Kalkulator Gaji' },
    href: '/tools/salary',
    icon: RiCalculatorLine,
    description: {
      en: 'See what an Indonesian salary offer pays after BPJS and PPh 21.',
      id: 'Cek gaji bersih dari tawaran kerja di Indonesia setelah dipotong BPJS dan PPh 21.',
    },
  },
] as const;

// The page that lists them all, the one to share
export const TOOLS_HUB = {
  title: { en: 'Free Tools', id: 'Tools Gratis' },
  href: '/tools',
  icon: RiToolsLine,
} as const;
