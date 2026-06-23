import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p: string) => readFileSync(root + p, 'utf8');

describe('résumé links', () => {
  it('appears on the links page as the third item, after LinkedIn', () => {
    const html = read('src/pages/links.astro');
    const github = html.indexOf('github.com/justinhelmer');
    const linkedin = html.indexOf('linkedin.com/in/justinhelmer');
    const resume = html.indexOf('href="/resume"');
    const email = html.indexOf('mailto:admin@justin.software');

    expect(resume).toBeGreaterThan(-1);
    // GitHub → LinkedIn → Resume → Email
    expect(github).toBeLessThan(linkedin);
    expect(linkedin).toBeLessThan(resume);
    expect(resume).toBeLessThan(email);
  });

  it('opens in a new tab so it bypasses the SPA router and hits the asset', () => {
    const html = read('src/pages/links.astro');
    const anchor = html.slice(html.indexOf('href="/resume"'));
    expect(anchor.slice(0, anchor.indexOf('>'))).toContain('target="_blank"');
  });

  it('is linked from the end of the about page', () => {
    const html = read('src/pages/about.astro');
    expect(html).toContain('href="/resume"');
  });
});
