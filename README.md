# BackToYourDay

Pick your birthday and travel back to the day itself: the historical
events, the famous people born, and those remembered on that date.

Live site: https://gr33nops.github.io/BackToYourDay/

## What it shows

- Your birthday profile: star sign, birthstone, and birth flower,
  derived locally from the date you pick
- What happened: historical events for that date, shown as a timeline
- Who was born: notable people who share your birthday
- Who we lost: notable people remembered on that date

Historical data comes from the free Wikipedia "On This Day" API. The
birthday profile needs no API.

## Built with

- React + TypeScript
- Vite
- Tailwind CSS (shadcn/ui compatible setup)
- Framer Motion for the animated effects (date reveal, image reveal,
  cursor trail)

The project is set up as a shadcn/ui registry consumer, so components
from registries such as Skiper UI can be added with the shadcn CLI.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushing to `main` triggers the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which builds the site and publishes it
to GitHub Pages.

## Structure

- `src/components` – UI sections (picker, results, profile, timeline, cards)
- `src/components/effects` – the animated effects
- `src/lib/zodiac.ts` – star sign, birthstone, and birth flower data
- `src/lib/onthisday.ts` – Wikipedia API client and helpers
