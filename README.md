# BackToYourDay

Travel back to your birthday and discover what happened that day.

Pick your birthday month and day, click "Take Me Back", and see
historical events, famous births, and notable deaths from that date.

Live site: https://gr33nops.github.io/BackToYourDay/

## What it shows

- What Happened: 3 historical events in a simple list, each with
  a year, a short text, and a Wikipedia link when available
- Who Was Born: 3 people in cards with a photo (when available),
  name, birth year, and short description
- Who Died: 3 people in the same card style

## Built with

HTML, CSS, and plain JavaScript. No frameworks. No database. No login.

Data comes from the free Wikipedia "On This Day" API.

Headings use a serif font, normal text uses a clean sans-serif font.
The layout is responsive: 3 cards per row on desktop, stacked on mobile.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Files

- index.html: page structure, birthday form, results sections
- style.css: colors, timeline, cards, and mobile layout
- script.js: reads the form, calls the API, shows the results

## How it works

1. JavaScript reads the month and day from the form.
2. It requests https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/MM/DD
3. It picks 3 random items from events, births, and deaths
   and adds them to the page as plain text, so the same
   date can show something new each time.
