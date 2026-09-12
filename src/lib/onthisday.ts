import { MONTH_NAMES } from "@/lib/zodiac";

export type Page = {
  title?: string;
  titles?: { normalized?: string };
  description?: string;
  extract?: string;
  thumbnail?: { source: string };
  content_urls?: { desktop?: { page: string } };
};

export type Entry = {
  year: number;
  text: string;
  pages?: Page[];
};

export type OnThisDay = {
  events: Entry[];
  births: Entry[];
  deaths: Entry[];
};

export async function fetchOnThisDay(month: number, day: number): Promise<OnThisDay> {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${mm}/${dd}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Wikipedia request failed");
  const data = await response.json();

  return {
    events: data.events ?? [],
    births: data.births ?? [],
    deaths: data.deaths ?? [],
  };
}

export function pickThree(items: Entry[]): Entry[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 3);
}

export function shorten(text: string | undefined, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function personName(entry: Entry): string {
  const page = entry.pages?.[0];
  return page?.titles?.normalized || page?.title || entry.text;
}

export function personDescription(entry: Entry): string {
  const page = entry.pages?.[0];
  if (page?.description) return page.description;
  if (page?.extract) return shorten(page.extract, 140);
  return entry.text;
}

export function wikipediaDateUrl(month: number, day: number): string {
  return `https://en.wikipedia.org/wiki/${MONTH_NAMES[month - 1]}_${day}`;
}
