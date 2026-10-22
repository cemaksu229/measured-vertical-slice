const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Formats a date like "Oct 29". */
export function formatShortDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** Date the trial ends: today plus `days` (default 7). */
export function trialEndDate(days = 7, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return formatShortDate(d);
}
