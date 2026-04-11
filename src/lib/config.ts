/** Shared utilities for the justin.software build. */

/** Format a Date as YYYY.MM for display. */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}.${m}`;
}

/** Sort posts by date descending with optional limit. */
export function latestPosts<T extends { data: { date: Date } }>(posts: T[], limit?: number): T[] {
  const sorted = [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}
