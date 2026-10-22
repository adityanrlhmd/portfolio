import {
  RiBarChartHorizontalLine,
  RiFolderLine,
  RiHomeLine,
  RiSendPlaneLine,
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
  typescript: { name: 'TypeScript', icon: typescriptIcon, inverted: false },
  javascript: { name: 'JavaScript', icon: javascriptIcon, inverted: false },
  'react-js': { name: 'React.js', icon: reactIcon, inverted: false },
  'next-js': { name: 'Next.js', icon: nextjsIcon, inverted: false },
  'react-native': { name: 'React Native', icon: reactIcon, inverted: false },
  'node-js': { name: 'Node.js', icon: nodejsIcon, inverted: false },
  tanstack: { name: 'TanStack', icon: tanstackIcon, inverted: false },
  graphql: { name: 'GraphQL', icon: graphqlIcon, inverted: false },
  apollo: { name: 'Apollo Client', icon: apolloIcon, inverted: true },
  zod: { name: 'Zod', icon: zodIcon, inverted: false },
  redux: { name: 'Redux', icon: reduxIcon, inverted: false },
  zustand: { name: 'Zustand', icon: zustandIcon, inverted: false },
  turborepo: { name: 'Turborepo', icon: turborepoIcon, inverted: true },
  vite: { name: 'Vite', icon: viteIcon, inverted: false },
  vitest: { name: 'Vitest', icon: vitestIcon, inverted: false },
  jest: { name: 'Jest', icon: jestIcon, inverted: false },
  'testing-library': {
    name: 'Testing Library',
    icon: testinglibraryIcon,
    inverted: false,
  },
  sonarqube: { name: 'SonarQube', icon: sonarqubeIcon, inverted: false },
  git: { name: 'Git', icon: gitIcon, inverted: false },
  tailwindcss: { name: 'Tailwind CSS', icon: tailwindIcon, inverted: false },
  'shadcn-ui': { name: 'shadcn/ui', icon: shadcnIcon, inverted: true },
  'ant-design': { name: 'Ant Design', icon: antdesignIcon, inverted: false },
  'framer-motion': {
    name: 'Framer Motion',
    icon: framermotionIcon,
    inverted: false,
  },
  'react-pdf': { name: 'React PDF', icon: reactpdfIcon, inverted: false },
  'express-js': { name: 'Express.js', icon: expressIcon, inverted: false },
  supabase: { name: 'Supabase', icon: supabaseIcon, inverted: false },
  firebase: { name: 'Firebase', icon: firebaseIcon, inverted: false },
  mongodb: { name: 'MongoDB', icon: mongodbIcon, inverted: false },
  mysql: { name: 'MySQL', icon: mysqlIcon, inverted: false },
  directus: { name: 'Directus', icon: directusIcon, inverted: false },
  'indexed-db': { name: 'IndexedDB', icon: indexeddbIcon, inverted: true },
  'socket-io': { name: 'Socket.io', icon: socketioIcon, inverted: true },
  expo: { name: 'Expo', icon: expoIcon, inverted: false },
  'vue-js': { name: 'Vue.js', icon: vueIcon, inverted: false },
  'google-maps': { name: 'Google Maps', icon: googlemapsIcon, inverted: false },
  moralis: { name: 'Moralis', icon: moralisIcon, inverted: false },
  web3: { name: 'Web3', icon: web3Icon, inverted: false },
  swift: { name: 'Swift', icon: swiftIcon, inverted: false },
  swiftui: { name: 'SwiftUI', icon: swiftuiIcon, inverted: false },
  vercel: { name: 'Vercel', icon: vercelIcon, inverted: true },
  html: { name: 'HTML', icon: htmlIcon, inverted: false },
  css: { name: 'CSS', icon: cssIcon, inverted: false },
};

export const NAVIGATIONS = [
  {
    title: 'Home',
    href: '#home',
    icon: RiHomeLine,
  },
  {
    title: 'Experience',
    href: '#experience',
    icon: RiBarChartHorizontalLine,
  },
  {
    title: 'Projects',
    href: '#projects',
    icon: RiFolderLine,
  },
  {
    title: 'Contact',
    href: '#contact',
    icon: RiSendPlaneLine,
  },
] as const;
