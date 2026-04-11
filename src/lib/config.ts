/**
 * Site-wide constants. Single source of truth for navigation order,
 * formatting, and shared configuration.
 */

/** Top-level page order — drives keyboard nav (←/→) and transition direction. */
export const PAGE_ORDER = ['/', '/about', '/writing', '/links'] as const;

/** Format a Date as YYYY.MM for display. */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}.${m}`;
}

/**
 * Resolve a pathname to its index in PAGE_ORDER.
 * Handles sub-pages: /writing/hello-world → index of /writing.
 */
export function getPageIndex(path: string): number {
  const exact = PAGE_ORDER.indexOf(path as typeof PAGE_ORDER[number]);
  if (exact !== -1) return exact;
  for (let i = PAGE_ORDER.length - 1; i >= 0; i--) {
    if (path.startsWith(PAGE_ORDER[i]) && PAGE_ORDER[i] !== '/') return i;
  }
  return 0;
}
