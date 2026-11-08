// One skill per line: the name shown, then other spellings, split by "|". A space also
// matches a hyphen. Matching ignores case, except on lines starting with "!", whose
// spellings must match exactly (so "we excel at" isn't Excel).
// shortcut: only skills on this list are found, add a line when a common one is missed.
const SKILL_LINES = [
  // Languages
  'JavaScript|js|es6',
  'TypeScript',
  'Python',
  'Java',
  'Kotlin',
  '!Swift',
  'Objective-C',
  'Dart',
  'PHP',
  'Ruby',
  'Golang|go lang',
  'Rust',
  'C++|cpp',
  'C#|csharp',
  '.NET|dotnet|ASP.NET',
  'Scala',
  'Elixir',
  'SQL',
  'HTML|html5',
  'CSS|css3',
  'Sass|scss',
  'Solidity',
  // Frontend & mobile
  'React|reactjs|react.js',
  'React Native',
  'Next.js|nextjs|next js',
  'Vue.js|vue|vuejs',
  'Nuxt|nuxt.js|nuxtjs',
  'Angular|angularjs',
  'Svelte|sveltekit',
  'Redux',
  'Zustand',
  'jQuery',
  'Tailwind CSS|tailwind|tailwindcss',
  'Bootstrap',
  'Three.js|threejs',
  'Flutter',
  'Expo',
  'SwiftUI',
  'Jetpack Compose',
  'Android',
  'iOS',
  'Webpack',
  'Vite',
  'Accessibility|a11y|wcag',
  'UI/UX|ui ux|user experience|user interface',
  'Figma',
  'Adobe XD',
  // Backend & APIs
  'Node.js|nodejs|node js',
  'Express.js|expressjs|express js',
  'NestJS|nest.js',
  'Django',
  'Flask',
  'FastAPI',
  'Spring Boot|spring framework',
  'Laravel',
  'CodeIgniter',
  'Ruby on Rails|rails',
  'GraphQL',
  'REST API|restful|rest apis|restful api',
  'gRPC',
  'WebSocket|websockets',
  'Socket.io',
  'Microservices|microservice',
  'Kafka|apache kafka',
  'RabbitMQ',
  'OAuth|oauth2',
  'JWT',
  'Postman',
  'Swagger|openapi',
  // Data stores
  'PostgreSQL|postgres',
  'MySQL',
  'SQL Server|mssql',
  'Oracle',
  'MongoDB|mongo',
  'Redis',
  'Elasticsearch|elastic search',
  'SQLite',
  'NoSQL',
  'DynamoDB',
  'Firebase',
  'Supabase',
  // Cloud & DevOps
  'AWS|amazon web services',
  'GCP|google cloud|google cloud platform',
  'Azure|microsoft azure',
  'Docker',
  'Kubernetes|k8s',
  'Terraform',
  'Ansible',
  'Jenkins',
  'GitHub Actions',
  'GitLab',
  'CI/CD|ci cd|cicd',
  'Linux',
  'Bash|shell scripting',
  'Nginx',
  'Git',
  'Vercel',
  // Testing & practice
  'Jest',
  'Vitest',
  'Cypress',
  'Playwright',
  'Selenium',
  'Testing Library|react testing library',
  'Unit testing|unit test|unit tests',
  'TDD|test driven development',
  'OOP|object oriented|object oriented programming',
  'Design patterns',
  'System design',
  'Data structures and algorithms|data structures|algorithms',
  'Agile',
  'Scrum',
  'Kanban',
  'Jira',
  'Confluence',
  'Trello',
  'Notion',
  'Asana',
  // Data & AI
  'Data analysis|analisis data|data analytics',
  'Statistics|statistik',
  'Machine learning|pembelajaran mesin',
  'Deep learning',
  'NLP|natural language processing',
  'Computer vision',
  'LLM|llms|large language model|large language models',
  'Prompt engineering',
  'Pandas',
  'NumPy',
  'TensorFlow',
  'PyTorch',
  'scikit-learn|sklearn',
  'Jupyter',
  'Apache Spark|spark|pyspark',
  'Airflow|apache airflow',
  'dbt',
  'Snowflake',
  'BigQuery',
  'ETL',
  'Data warehouse|data warehousing',
  'Tableau',
  'Power BI|powerbi',
  'Looker Studio|google data studio|data studio',
  // Security & IT
  'Cybersecurity|cyber security|keamanan siber',
  'Penetration testing|pentest|pentesting',
  'CCNA',
  'ITIL',
  'Troubleshooting',
  'Web3',
  'Blockchain',
  'Unity',
  'Unreal Engine',
  'WordPress',
  'Shopify',
  // Office & business tools
  '!Excel|Microsoft Excel|MS Excel',
  'Microsoft Word|ms word',
  'PowerPoint|power point',
  'Microsoft Office|ms office',
  'Google Sheets|google spreadsheet',
  'Google Workspace',
  '!SAP',
  'Salesforce',
  'HubSpot',
  'Canva',
  'Photoshop|adobe photoshop',
  'Illustrator|adobe illustrator',
  'Premiere Pro|adobe premiere',
  'After Effects',
  'CorelDRAW',
  'AutoCAD',
  'SketchUp',
  'SolidWorks',
  // Marketing & sales
  'Digital marketing|pemasaran digital',
  'Social media|media sosial|social media marketing',
  'SEO|search engine optimization',
  'SEM|search engine marketing',
  'Google Analytics',
  'Google Ads',
  'Meta Ads|facebook ads|instagram ads',
  'Email marketing',
  'Copywriting',
  'Content writing|penulisan konten|content creation',
  'Sales|penjualan',
  'Customer service|layanan pelanggan|pelayanan pelanggan',
  // Finance, HR & operations
  'Accounting|akuntansi',
  'Bookkeeping|pembukuan',
  'Taxation|perpajakan|pajak|tax',
  'Financial analysis|analisis keuangan',
  'Financial reporting|laporan keuangan',
  'Budgeting|penganggaran',
  'Auditing|audit',
  'Payroll|penggajian',
  'Recruitment|rekrutmen|recruiting',
  'Project management|manajemen proyek',
  'Supply chain|rantai pasok',
  'Logistics|logistik',
  'Inventory management|manajemen inventori|inventory control',
  'Procurement|pengadaan',
  'Data entry|entri data|input data',
  'Administration|administrasi',
  'Six Sigma|lean six sigma',
  // Soft skills & languages
  'Communication|komunikasi',
  'Leadership|kepemimpinan',
  'Teamwork|team player|kerja sama tim|kerjasama tim',
  'Problem solving|pemecahan masalah',
  'Critical thinking|berpikir kritis',
  'Time management|manajemen waktu',
  'Negotiation|negosiasi',
  'Public speaking',
  'Attention to detail|detail oriented|teliti',
  'English|bahasa inggris',
  'Mandarin|bahasa mandarin',
  'Japanese|bahasa jepang',
];

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Longest spelling first, so "React Native" is taken out before "React" can count it.
const SPELLINGS = SKILL_LINES.flatMap(line => {
  const exact = line.startsWith('!');
  const [name, ...others] = line.replace(/^!/, '').split('|');
  return [name, ...others].map(spelling => ({
    name,
    length: spelling.length,
    // edges are any non letter/digit, so "C++," and ".NET" match but "nodes" isn't Node
    pattern: new RegExp(
      `(?<![\\p{L}\\p{N}])${escape(spelling).replace(/ /g, '[\\s-]+')}(?![\\p{L}\\p{N}])`,
      exact ? 'gu' : 'giu'
    ),
  }));
}).sort((a, b) => b.length - a.length);

// How many times each known skill is mentioned.
export const findSkills = (text: string) => {
  const counts = new Map<string, number>();
  let rest = text;
  for (const { name, pattern } of SPELLINGS) {
    rest = rest.replace(pattern, () => {
      counts.set(name, (counts.get(name) ?? 0) + 1);
      return ' ';
    });
  }
  return counts;
};

export type SkillHit = { name: string; count: number };

// The job post's skills, most mentioned first, split by whether the resume has them.
export const compareSkills = (resume: string, job: string) => {
  const inResume = findSkills(resume);
  const asked: SkillHit[] = [...findSkills(job)]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return {
    missing: asked.filter(skill => !inResume.has(skill.name)),
    matched: asked.filter(skill => inResume.has(skill.name)),
  };
};
