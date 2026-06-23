import { describe, expect, it } from 'vitest';
import { cfDecode } from './email';

describe('cfDecode', () => {
  it('decodes a Cloudflare token (first byte is the XOR key)', () => {
    // admin@justin.software obfuscated with key 0x1a, as Cloudflare emits it.
    expect(cfDecode('1a7b7e7773745a706f696e73743469757c6e6d7b687f')).toBe(
      'admin@justin.software',
    );
  });

  it('is independent of the key byte', () => {
    // Same address, different key — Cloudflare rotates the key per render.
    expect(cfDecode('7f1e1b1216113f150a0c0b1611510c10190b081e0d1a')).toBe(
      'admin@justin.software',
    );
  });

  it('handles a zero key', () => {
    expect(cfDecode('006140622e636f')).toBe('a@b.co');
  });
});
