// BackToYourDay
// Uses the free Wikipedia "On This Day" API:
// https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/MM/DD

// Get the page elements we need.
const hero = document.getElementById("hero");
const form = document.getElementById("birthday-form");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");
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

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Remember the last search so "Try Again" can repeat it.
let lastMonth = "";
let lastDay = "";

// Fill the day dropdown with 1 to 31.
for (let d = 1; d <= 31; d++) {
  const option = document.createElement("option");
  option.value = d;
  option.textContent = d;
  daySelect.appendChild(option);
}

// Make one event entry: year, text, and a link if Wikipedia has one.
// textContent is used everywhere so API text is never run as HTML.
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

// Shorten a long description to a readable length.
function shorten(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Make one person card: photo (if any), name, year, short description.
function toPersonCard(item, yearLabel) {
  const card = document.createElement("div");
  card.className = "person-card";

  const page = item.pages && item.pages[0];

  if (page && page.thumbnail && page.thumbnail.source) {
    const img = document.createElement("img");
    img.src = page.thumbnail.source;
    img.alt = "";
    img.loading = "lazy";
    // If the photo fails to load, remove it and keep the text.
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

// Pick 3 random items, so searching the same date can show something new.
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

// Fill a box with 3 items made by the given function.
function showItems(box, items, makeCard) {
  box.textContent = "";
  const picked = pickThree(items);
  if (picked.length === 0) {
    // Use "li" inside lists and "p" everywhere else.
    const empty = document.createElement(box.tagName === "DIV" ? "p" : "li");
    empty.textContent = "Nothing found for this day.";
    box.appendChild(empty);
    return;
  }
  picked.forEach(function (item) {
    box.appendChild(makeCard(item));
  });
}

// Fetch the data for one month/day and show the results.
async function search(month, day) {
  lastMonth = month;
  lastDay = day;

  statusEl.textContent = "Traveling back in time...";
  errorBox.classList.add("hidden");
  resultsEl.classList.add("hidden");
  hero.classList.add("hidden");

  try {
    // The API needs two digits, so 9 becomes 09.
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const url = "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/" + mm + "/" + dd;

    const response = await fetch(url);
    if (!response.ok) throw new Error("API error");
    const data = await response.json();

    headlineEl.textContent = MONTH_NAMES[month - 1] + " " + day;
    showItems(eventsList, data.events || [], toEventItem);
    showItems(birthsList, data.births || [], function (item) {
      return toPersonCard(item, "Born");
    });
    showItems(deathsList, data.deaths || [], function (item) {
      return toPersonCard(item, "Died");
    });
    sourceLink.href = "https://en.wikipedia.org/wiki/" + MONTH_NAMES[month - 1] + "_" + day;

    statusEl.textContent = "";
    resultsEl.classList.remove("hidden");
    resultsEl.scrollIntoView();
  } catch (error) {
    statusEl.textContent = "";
    hero.classList.remove("hidden");
    errorBox.classList.remove("hidden");
  }
}

// "Take Me Back" starts a search with the chosen date.
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!monthSelect.value || !daySelect.value) return;
  search(monthSelect.value, daySelect.value);
});

// "Try Again" repeats the last search.
retryBtn.addEventListener("click", function () {
  if (lastMonth && lastDay) search(lastMonth, lastDay);
});

// "Choose Another Birthday" goes back to the picker.
againBtn.addEventListener("click", function () {
  resultsEl.classList.add("hidden");
  hero.classList.remove("hidden");
  window.scrollTo(0, 0);
});
