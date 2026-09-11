const hero = document.getElementById("hero");
const form = document.getElementById("birthday-form");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");
const loader = document.getElementById("loader");
const statusEl = document.getElementById("status");
const errorBox = document.getElementById("error-box");
const retryBtn = document.getElementById("retry-btn");
const resultsEl = document.getElementById("results");
const headlineEl = document.getElementById("headline");
const eventsList = document.getElementById("events-list");
const birthsList = document.getElementById("births-list");
const deathsList = document.getElementById("deaths-list");
const sourceLink = document.getElementById("source-link");
const againBtn = document.getElementById("again-btn");

const zodiacSymbol = document.getElementById("zodiac-symbol");
const zodiacName = document.getElementById("zodiac-name");
const zodiacDates = document.getElementById("zodiac-dates");
const zodiacElement = document.getElementById("zodiac-element");
const zodiacTraits = document.getElementById("zodiac-traits");
const birthstoneEl = document.getElementById("birthstone");
const birthFlowerEl = document.getElementById("birth-flower");

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const LOADING_LINES = [
  "Winding back the clock...",
  "Dusting off the almanac...",
  "Setting the dials...",
  "Turning the pages of history...",
  "Warming up the time machine..."
];

const ZODIAC = [
  { name: "Capricorn",   symbol: "♑", element: "Earth", traits: "Ambitious · Patient · Grounded",     dates: "Dec 22 – Jan 19", start: [12, 22], end: [1, 19]  },
  { name: "Aquarius",    symbol: "♒", element: "Air",   traits: "Original · Open-minded · Independent", dates: "Jan 20 – Feb 18", start: [1, 20],  end: [2, 18]  },
  { name: "Pisces",      symbol: "♓", element: "Water", traits: "Gentle · Creative · Empathetic",       dates: "Feb 19 – Mar 20", start: [2, 19],  end: [3, 20]  },
  { name: "Aries",       symbol: "♈", element: "Fire",  traits: "Bold · Driven · Spirited",             dates: "Mar 21 – Apr 19", start: [3, 21],  end: [4, 19]  },
  { name: "Taurus",      symbol: "♉", element: "Earth", traits: "Steady · Loyal · Grounded",            dates: "Apr 20 – May 20", start: [4, 20],  end: [5, 20]  },
  { name: "Gemini",      symbol: "♊", element: "Air",   traits: "Curious · Witty · Lively",             dates: "May 21 – Jun 20", start: [5, 21],  end: [6, 20]  },
  { name: "Cancer",      symbol: "♋", element: "Water", traits: "Caring · Intuitive · Loyal",           dates: "Jun 21 – Jul 22", start: [6, 21],  end: [7, 22]  },
  { name: "Leo",         symbol: "♌", element: "Fire",  traits: "Warm · Confident · Generous",          dates: "Jul 23 – Aug 22", start: [7, 23],  end: [8, 22]  },
  { name: "Virgo",       symbol: "♍", element: "Earth", traits: "Thoughtful · Precise · Kind",          dates: "Aug 23 – Sep 22", start: [8, 23],  end: [9, 22]  },
  { name: "Libra",       symbol: "♎", element: "Air",   traits: "Charming · Fair · Easygoing",          dates: "Sep 23 – Oct 22", start: [9, 23],  end: [10, 22] },
  { name: "Scorpio",     symbol: "♏", element: "Water", traits: "Magnetic · Loyal · Determined",        dates: "Oct 23 – Nov 21", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", symbol: "♐", element: "Fire",  traits: "Adventurous · Honest · Optimistic",    dates: "Nov 22 – Dec 21", start: [11, 22], end: [12, 21] }
];

const BIRTHSTONES = [
  "Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl",
  "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise"
];

const BIRTH_FLOWERS = [
  "Carnation", "Violet", "Daffodil", "Daisy", "Lily of the valley", "Rose",
  "Larkspur", "Gladiolus", "Aster", "Marigold", "Chrysanthemum", "Narcissus"
];

let lastMonth = "";
let lastDay = "";

for (let d = 1; d <= 31; d++) {
  const option = document.createElement("option");
  option.value = d;
  option.textContent = d;
  daySelect.appendChild(option);
}

function getZodiac(month, day) {
  for (const sign of ZODIAC) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    const afterStart = month > sm || (month === sm && day >= sd);
    const beforeEnd = month < em || (month === em && day <= ed);
    if (sm <= em ? (afterStart && beforeEnd) : (afterStart || beforeEnd)) {
      return sign;
    }
  }
  return ZODIAC[0];
}

function showProfile(month, day) {
  const sign = getZodiac(month, day);
  zodiacSymbol.textContent = sign.symbol + "︎";
  zodiacName.textContent = sign.name;
  zodiacDates.textContent = sign.dates;
  zodiacElement.textContent = sign.element + " sign";
  zodiacTraits.textContent = sign.traits;
  birthstoneEl.textContent = BIRTHSTONES[month - 1];
  birthFlowerEl.textContent = BIRTH_FLOWERS[month - 1];
}

function toEventItem(item) {
  const li = document.createElement("li");

  const year = document.createElement("span");
  year.className = "year";
  year.textContent = item.year;
  li.appendChild(year);

  const text = document.createElement("p");
  text.textContent = item.text;
  li.appendChild(text);

  const page = item.pages && item.pages[0];
  if (page && page.content_urls && page.content_urls.desktop) {
    const link = document.createElement("a");
    link.textContent = "Read more on Wikipedia";
    link.href = page.content_urls.desktop.page;
    link.target = "_blank";
    link.rel = "noopener";
    li.appendChild(link);
  }

  return li;
}

function shorten(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

function toPersonCard(item, yearLabel) {
  const card = document.createElement("div");
  card.className = "person-card";

  const page = item.pages && item.pages[0];

  if (page && page.thumbnail && page.thumbnail.source) {
    const img = document.createElement("img");
    img.src = page.thumbnail.source;
    img.alt = "";
    img.loading = "lazy";
    img.addEventListener("error", function () {
      img.remove();
    });
    card.appendChild(img);
  }

  const body = document.createElement("div");
  body.className = "person-body";

  const name = document.createElement("h4");
  if (page && page.titles) {
    name.textContent = page.titles.normalized || page.title;
  } else {
    name.textContent = item.text;
  }
  body.appendChild(name);

  const year = document.createElement("p");
  year.className = "year";
  year.textContent = yearLabel + " " + item.year;
  body.appendChild(year);

  const desc = document.createElement("p");
  if (page && page.description) {
    desc.textContent = page.description;
  } else if (page && page.extract) {
    desc.textContent = shorten(page.extract, 140);
  } else {
    desc.textContent = item.text;
  }
  body.appendChild(desc);

  card.appendChild(body);
  return card;
}

function pickThree(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy.slice(0, 3);
}

function showItems(box, items, makeCard) {
  box.textContent = "";
  const picked = pickThree(items);
  if (picked.length === 0) {
    const empty = document.createElement(box.tagName === "DIV" ? "p" : "li");
    empty.textContent = "Nothing found for this day.";
    box.appendChild(empty);
    return;
  }
  picked.forEach(function (item) {
    box.appendChild(makeCard(item));
  });
}

async function search(month, day) {
  lastMonth = month;
  lastDay = day;

  statusEl.textContent = LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)];
  loader.classList.remove("hidden");
  errorBox.classList.add("hidden");
  resultsEl.classList.add("hidden");
  hero.classList.add("hidden");

  try {
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const url = "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/" + mm + "/" + dd;

    const response = await fetch(url);
    if (!response.ok) throw new Error("API error");
    const data = await response.json();

    headlineEl.textContent = MONTH_NAMES[month - 1] + " " + day;
    showProfile(Number(month), Number(day));
    showItems(eventsList, data.events || [], toEventItem);
    showItems(birthsList, data.births || [], function (item) {
      return toPersonCard(item, "Born");
    });
    showItems(deathsList, data.deaths || [], function (item) {
      return toPersonCard(item, "Died");
    });
    sourceLink.href = "https://en.wikipedia.org/wiki/" + MONTH_NAMES[month - 1] + "_" + day;

    loader.classList.add("hidden");
    resultsEl.classList.remove("hidden");
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    loader.classList.add("hidden");
    hero.classList.remove("hidden");
    errorBox.classList.remove("hidden");
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!monthSelect.value || !daySelect.value) return;
  search(monthSelect.value, daySelect.value);
});

retryBtn.addEventListener("click", function () {
  if (lastMonth && lastDay) search(lastMonth, lastDay);
});

againBtn.addEventListener("click", function () {
  resultsEl.classList.add("hidden");
  hero.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
