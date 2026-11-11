import { CASE_STUDY, TOOLS, TOOLS_HUB } from '@/lib/config';
import SEO_PAGES from '@/lib/seo.json';

describe('seo.json', () => {
  it('covers every tool and case study page, and nothing else', () => {
    const routes = [
      TOOLS_HUB.href,
      ...TOOLS.map(tool => tool.href),
      CASE_STUDY.resumeBuilder,
      CASE_STUDY.saku,
    ];
    expect(Object.keys(SEO_PAGES).sort()).toEqual(routes.sort());
  });
});
