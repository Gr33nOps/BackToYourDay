export function isValidStoryDate(year, month, day, maxYear = new Date().getFullYear()) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (year < 1920 || year > maxYear || month < 1 || month > 12 || day < 1) return false;
  const candidate = new Date(Date.UTC(year, month - 1, day, 12));
  return candidate.getUTCFullYear() === year
    && candidate.getUTCMonth() === month - 1
    && candidate.getUTCDate() === day;
}

export function readStoryDate(search, maxYear = new Date().getFullYear()) {
  const params = new URLSearchParams(search);
  const raw = [params.get("year"), params.get("month"), params.get("day")];
  if (raw.some((value) => value === null || !/^\d+$/.test(value))) return null;
  const [year, month, day] = raw.map(Number);
  return isValidStoryDate(year, month, day, maxYear)
    ? new Date(year, month - 1, day, 12)
    : null;
}
