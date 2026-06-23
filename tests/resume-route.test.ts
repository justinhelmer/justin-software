import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p: string) => readFileSync(root + p);

describe('/resume route', () => {
  it('rewrites /resume to the PDF with a 200 (proxy, URL stays /resume)', () => {
    const redirects = read('public/_redirects').toString();
    const rule = redirects
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#'));
    // A 200 rewrite keeps the clean URL and lets the browser decide
    // view-vs-download from the PDF's content type.
    expect(rule).toBe('/resume /resume.pdf 200');
  });

  it('ships a valid PDF at the rewrite target', () => {
    const pdf = read('public/resume.pdf');
    expect(pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-');
  });
});
