/** Shared utilities for the justin.software build. */

/** Format a Date as YYYY.MM.DD for display. `z.coerce.date()` parses a bare
 * "YYYY-MM-DD" frontmatter value as UTC midnight, so this reads it back in
 * UTC too — local getters roll the date back a day west of UTC. */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** Sort posts by date descending with optional limit. */
export function latestPosts<T extends { data: { date: Date } }>(posts: T[], limit?: number): T[] {
  const sorted = [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}
