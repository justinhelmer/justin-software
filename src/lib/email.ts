/** Cloudflare email-obfuscation helpers (framework- and DOM-agnostic). */

/**
 * Decode a Cloudflare-obfuscated email token.
 *
 * Cloudflare stores the address as hex where the first byte is an XOR key for
 * every following byte (the value of a `data-cfemail` attribute or the part
 * after `#` in a `/cdn-cgi/l/email-protection#…` href). This mirrors
 * Cloudflare's own `email-decode.min.js` so we can re-run the decode after
 * client-side (SPA) navigations, where their script does not fire again.
 */
export function cfDecode(token: string): string {
  const key = parseInt(token.slice(0, 2), 16);
  let out = '';
  for (let i = 2; i < token.length; i += 2) {
    out += String.fromCharCode(parseInt(token.slice(i, i + 2), 16) ^ key);
  }
  // Recover UTF-8 byte sequences (e.g. addresses with non-ASCII characters).
  try {
    return decodeURIComponent(escape(out));
  } catch {
    return out;
  }
}
