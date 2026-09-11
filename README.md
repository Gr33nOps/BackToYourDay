# BackToYourDay

Pick your birthday and travel back to the day itself: the historical
events, the famous people born, and those remembered on that date.

Live site: https://gr33nops.github.io/BackToYourDay/

## What it shows

- Your birthday profile: star sign, birthstone, and birth flower,
  all worked out from the date you pick
- What happened: historical events for that date, shown as a timeline
- Who was born: notable people who share your birthday
- Who we lost: notable people remembered on that date

## Built with

HTML, CSS, and plain JavaScript. No frameworks, no build step, no login.

Historical data comes from the free Wikipedia "On This Day" API. The
birthday profile is derived locally from the date, so it needs no API.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Files

- index.html: page structure, birthday form, results sections
- style.css: colours, type, timeline, cards, and responsive layout
- script.js: reads the form, works out the profile, calls the API,
  and renders the results

## How it works

1. The form gives a month and day.
2. The star sign, birthstone, and birth flower are looked up locally.
3. The date is sent to
   https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/MM/DD
4. Three events, births, and deaths are chosen at random, so the same
   date can surface something different each visit.
