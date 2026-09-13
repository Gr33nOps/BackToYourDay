/**
 * BackToYourDay Almanac: Authentic astronomical, chronological, and cultural identity.
 * Grounded in historical records, botanical traditions, and classical astronomical associations.
 */

export interface WesternZodiac {
  name: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  dates: string;
  traditionalRuler: string;
  rulerContext: string;
  constellation: string;
  seasonContext: string;
  latinMotto: string;
}

export interface ChineseZodiac {
  animal: string;
  element: "Wood" | "Fire" | "Earth" | "Metal" | "Water";
  polarity: "Yang" | "Yin";
  fullSign: string;
  symbol: string;
  significance: string;
}

export interface BirthBotanicals {
  primary: { name: string; meaning: string };
  secondary: { name: string; meaning: string };
}

export interface BirthstoneInfo {
  primary: string;
  alternate?: string;
  lore: string;
  colorHex: string;
}

export interface LifeMetrics {
  daysLived: number;
  hoursLived: number;
  approximateHeartbeats: number;
  earthOrbits: number;
  daysUntilNextBirthday: number;
  ageYears: number;
  weekdayBorn: string;
  weekdayLore: string;
  season: string;
}

export interface BirthdayIdentity {
  western: WesternZodiac;
  chinese: ChineseZodiac;
  botanicals: BirthBotanicals;
  birthstone: BirthstoneInfo;
  metrics: LifeMetrics;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WESTERN_ZODIAC_DATA: (Omit<WesternZodiac, "dates"> & { start: [number, number]; end: [number, number]; dates: string })[] = [
  {
    name: "Capricorn",
    symbol: "CAP",
    element: "Earth",
    dates: "Dec 22 – Jan 19",
    traditionalRuler: "Saturn",
    rulerContext: "Classical ruler of structure, persistence, and the passage of time.",
    constellation: "The Sea-Goat",
    seasonContext: "Marked by the winter solstice, turning darkness back toward light.",
    latinMotto: "Ex nihilo nihil fit (From perseverance comes mastery)",
    start: [12, 22],
    end: [1, 19],
  },
  {
    name: "Aquarius",
    symbol: "AQU",
    element: "Air",
    dates: "Jan 20 – Feb 18",
    traditionalRuler: "Saturn",
    rulerContext: "In classical Hellenistic astrology, ruled by Saturn representing contemplation and profound vision.",
    constellation: "The Water-Bearer",
    seasonContext: "Mid-winter clarity and the deep currents beneath frozen earth.",
    latinMotto: "Sapere aude (Dare to know)",
    start: [1, 20],
    end: [2, 18],
  },
  {
    name: "Pisces",
    symbol: "PSC",
    element: "Water",
    dates: "Feb 19 – Mar 20",
    traditionalRuler: "Jupiter",
    rulerContext: "Historically ruled by Jupiter representing wisdom, expansive dreams, and boundless empathy.",
    constellation: "The Two Fishes",
    seasonContext: "The final thaw before spring's awakening.",
    latinMotto: "Omnia vincit amor (Love and imagination endure)",
    start: [2, 19],
    end: [3, 20],
  },
  {
    name: "Aries",
    symbol: "ARI",
    element: "Fire",
    dates: "Mar 21 – Apr 19",
    traditionalRuler: "Mars",
    rulerContext: "Classical ruler of spark, vital momentum, and courageous initiative.",
    constellation: "The Ram",
    seasonContext: "Begins at the vernal equinox, the dawn of the astronomical year.",
    latinMotto: "Audentes fortuna iuvat (Fortune favors the bold)",
    start: [3, 21],
    end: [4, 19],
  },
  {
    name: "Taurus",
    symbol: "TAU",
    element: "Earth",
    dates: "Apr 20 – May 20",
    traditionalRuler: "Venus",
    rulerContext: "Historically ruled by Venus representing sensory harmony, patience, and steadfast devotion.",
    constellation: "The Bull",
    seasonContext: "High spring, when nature takes deep root and flourishes in full bloom.",
    latinMotto: "Labor omnia vincit (Steady dedication triumphs)",
    start: [4, 20],
    end: [5, 20],
  },
  {
    name: "Gemini",
    symbol: "GEM",
    element: "Air",
    dates: "May 21 – Jun 20",
    traditionalRuler: "Mercury",
    rulerContext: "Classical ruler of communication, perception, and agile intellectual curiosity.",
    constellation: "The Twins",
    seasonContext: "Late spring turning to summer, vibrant with exchange and pollination.",
    latinMotto: "Omnia mutatur, nihil interit (Everything changes, nothing is lost)",
    start: [5, 21],
    end: [6, 20],
  },
  {
    name: "Cancer",
    symbol: "CAN",
    element: "Water",
    dates: "Jun 21 – Jul 22",
    traditionalRuler: "The Moon",
    rulerContext: "Ruled by the Moon, guiding memory, protective instincts, and emotional tides.",
    constellation: "The Crab",
    seasonContext: "Commences at the summer solstice, the peak of annual solar light.",
    latinMotto: "Caritas numquam excidit (Devotion never fails)",
    start: [6, 21],
    end: [7, 22],
  },
  {
    name: "Leo",
    symbol: "LEO",
    element: "Fire",
    dates: "Jul 23 – Aug 22",
    traditionalRuler: "The Sun",
    rulerContext: "Ruled by the Sun, radiating sovereignty, generous warmth, and creative vitality.",
    constellation: "The Lion",
    seasonContext: "Midsummer zenith, radiant warmth, and fullness of creative expression.",
    latinMotto: "Sol invictus (The unconquered sun)",
    start: [7, 23],
    end: [8, 22],
  },
  {
    name: "Virgo",
    symbol: "VIR",
    element: "Earth",
    dates: "Aug 23 – Sep 22",
    traditionalRuler: "Mercury",
    rulerContext: "In classical astrology, Mercury here signifies discernment, meticulous craftsmanship, and healing care.",
    constellation: "The Maiden",
    seasonContext: "The transition from summer to autumn, the season of meticulous harvest.",
    latinMotto: "Per aspera ad astra (Through precision to brilliance)",
    start: [8, 23],
    end: [9, 22],
  },
  {
    name: "Libra",
    symbol: "LIB",
    element: "Air",
    dates: "Sep 23 – Oct 22",
    traditionalRuler: "Venus",
    rulerContext: "Historically ruled by Venus representing equilibrium, justice, and elegant reciprocity.",
    constellation: "The Scales",
    seasonContext: "Autumnal equinox, the momentary balance of light and dark.",
    latinMotto: "Iustitia nemini neganda (Balance and justice in all things)",
    start: [9, 23],
    end: [10, 22],
  },
  {
    name: "Scorpio",
    symbol: "SCO",
    element: "Water",
    dates: "Oct 23 – Nov 21",
    traditionalRuler: "Mars",
    rulerContext: "In classical Hellenistic astrology, ruled by Mars representing tenacity, strategic depth, and profound renewal.",
    constellation: "The Scorpion",
    seasonContext: "Deep autumn, when trees shed leaves and nature descends into fertile quiet.",
    latinMotto: "Post tenebras lux (After darkness comes illumination)",
    start: [10, 23],
    end: [11, 21],
  },
  {
    name: "Sagittarius",
    symbol: "SAG",
    element: "Fire",
    dates: "Nov 22 – Dec 21",
    traditionalRuler: "Jupiter",
    rulerContext: "Ruled by Jupiter representing philosophical exploration, expansive perspective, and truth-seeking.",
    constellation: "The Archer",
    seasonContext: "Late autumn dusk, aiming arrows toward unseen horizons before winter solstice.",
    latinMotto: "Ad astra per aspera (Toward the furthest horizons)",
    start: [11, 22],
    end: [12, 21],
  },
];

export function getWesternZodiac(month: number, day: number): WesternZodiac {
  for (const sign of WESTERN_ZODIAC_DATA) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    const afterStart = month > sm || (month === sm && day >= sd);
    const beforeEnd = month < em || (month === em && day <= ed);
    if (sm <= em ? afterStart && beforeEnd : afterStart || beforeEnd) {
      const { start: _s, end: _e, ...rest } = sign;
      return rest;
    }
  }
  return WESTERN_ZODIAC_DATA[0];
}

const CHINESE_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

const CHINESE_ANIMAL_SYMBOLS = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"
];

const CHINESE_ELEMENTS: ("Wood" | "Fire" | "Earth" | "Metal" | "Water")[] = [
  "Wood", "Fire", "Earth", "Metal", "Water"
];

export function getChineseZodiac(year: number, month: number, day: number): ChineseZodiac {
  // Approximate lunar new year cutoff (typically around Feb 4, Start of Spring Lichun)
  let effectiveYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    effectiveYear -= 1;
  }

  const offset = (effectiveYear - 4) % 60;
  const normalizedOffset = offset < 0 ? offset + 60 : offset;

  const animalIndex = normalizedOffset % 12;
  const elementIndex = Math.floor((normalizedOffset % 10) / 2);
  const isYang = (normalizedOffset % 2) === 0;

  const animal = CHINESE_ANIMALS[animalIndex];
  const element = CHINESE_ELEMENTS[elementIndex];
  const symbol = CHINESE_ANIMAL_SYMBOLS[animalIndex];
  const polarity = isYang ? "Yang" : "Yin";

  const significanceMap: Record<string, string> = {
    Rat: "Ingenious, resourceful, and sharp-witted in discovering new paths.",
    Ox: "Grounded, resolute, and enduring with patient fortitude.",
    Tiger: "Dynamic, courageous, and commanding with natural authority.",
    Rabbit: "Gracious, discerning, and diplomatic with keen aesthetic sensibility.",
    Dragon: "Magnificent, ambitious, and visionary with magnetic momentum.",
    Snake: "Perceptive, enigmatic, and intuitive with reflective depth.",
    Horse: "Spirited, swift, and free with boundless adventurous vitality.",
    Goat: "Empathetic, artistic, and peace-loving with quiet grace.",
    Monkey: "Agile, inventive, and inquisitive with multifaceted versatility.",
    Rooster: "Punctual, observant, and candid with meticulous dedication.",
    Dog: "Loyal, steadfast, and just with heartfelt sincerity.",
    Pig: "Warm-hearted, honest, and generous with an enduring love for fellowship."
  };

  return {
    animal,
    element,
    polarity,
    fullSign: `${polarity} ${element} ${animal}`,
    symbol,
    significance: `${element} ${animal}: ${significanceMap[animal] || "A distinguished year of character."}`,
  };
}

const BIRTHSTONES_DATA: BirthstoneInfo[] = [
  { primary: "Garnet", lore: "Symbol of protection, warmth, and enduring loyalty through winter journeys.", colorHex: "#7b1113" },
  { primary: "Amethyst", lore: "Classical crystal of serenity, clear contemplation, and balanced thought.", colorHex: "#68329b" },
  { primary: "Aquamarine", alternate: "Bloodstone", lore: "Carries the pale blue serenity of calm seas and clear morning skies.", colorHex: "#4fc3f7" },
  { primary: "Diamond", lore: "The hardest natural gem, celebrated across millennia for unyielding resilience and clarity.", colorHex: "#e2e8f0" },
  { primary: "Emerald", lore: "Prized since Antiquity as the jewel of rebirth, verdant forests, and flourishing wisdom.", colorHex: "#059669" },
  { primary: "Pearl", alternate: "Alexandrite", lore: "Formed organically within oceanic depths, symbolizing organic grace and wisdom.", colorHex: "#f1f5f9" },
  { primary: "Ruby", lore: "The king of gems in classical antiquity, glowing with radiant warmth and courage.", colorHex: "#dc2626" },
  { primary: "Peridot", alternate: "Spinel", lore: "Ancient 'gem of the sun' forged deep within Earth's mantle and found in meteorites.", colorHex: "#84cc16" },
  { primary: "Sapphire", lore: "Celestial gem evoking evening twilights, revered as a beacon of truth and calm focus.", colorHex: "#1d4ed8" },
  { primary: "Opal", alternate: "Tourmaline", lore: "Displays kaleidoscopic play-of-color, capturing autumn light across every spectral hue.", colorHex: "#f0abfc" },
  { primary: "Topaz", alternate: "Citrine", lore: "Golden amber gemstone echoing late autumn harvests and fireside warmth.", colorHex: "#d97706" },
  { primary: "Turquoise", alternate: "Tanzanite", lore: "One of the earliest mined gemstones, cherished by ancient cultures for traveler safety.", colorHex: "#0d9488" }
];

const BOTANICALS_DATA: BirthBotanicals[] = [
  { primary: { name: "Carnation", meaning: "Enduring devotion and warmth" }, secondary: { name: "Snowdrop", meaning: "Hope emerging through snow" } },
  { primary: { name: "Violet", meaning: "Modesty and thoughtful faithfulness" }, secondary: { name: "Primrose", meaning: "Early youth and spring's renewal" } },
  { primary: { name: "Daffodil", meaning: "Rebirth, joy, and sunny beginnings" }, secondary: { name: "Jonquil", meaning: "Desire for true companionship" } },
  { primary: { name: "Daisy", meaning: "Innocence, loyal love, and simplicity" }, secondary: { name: "Sweet Pea", meaning: "Blissful departure and gratitude" } },
  { primary: { name: "Lily of the Valley", meaning: "Sweetness and returned happiness" }, secondary: { name: "Hawthorn", meaning: "Hope and protective sanctuary" } },
  { primary: { name: "Rose", meaning: "Love, honor, and beauty in full bloom" }, secondary: { name: "Honeysuckle", meaning: "Bonds of devotion and generous affection" } },
  { primary: { name: "Larkspur", meaning: "Lighthearted spirit and open heart" }, secondary: { name: "Water Lily", meaning: "Purity of mind and calm waters" } },
  { primary: { name: "Gladiolus", meaning: "Strength of character and sincerity" }, secondary: { name: "Poppy", meaning: "Pleasure, remembrance, and restful dream" } },
  { primary: { name: "Aster", meaning: "Wisdom, faith, and late-summer grace" }, secondary: { name: "Morning Glory", meaning: "Affection and morning clarity" } },
  { primary: { name: "Marigold", meaning: "Warmth, passion, and creative brilliance" }, secondary: { name: "Cosmos", meaning: "Order, peace, and natural harmony" } },
  { primary: { name: "Chrysanthemum", meaning: "Loyalty, optimism, and longevity" }, secondary: { name: "Peony", meaning: "Prosperity, honor, and compassion" } },
  { primary: { name: "Narcissus", meaning: "Faithfulness, renewal, and sweet dream" }, secondary: { name: "Holly", meaning: "Domestic happiness and evergreen defense" } }
];

const WEEKDAY_LORE: Record<string, string> = {
  Sunday: "A child born on Sunday carries a bright spirit and generous warmth.",
  Monday: "Monday's child is fair of face and thoughtful in quiet reflection.",
  Tuesday: "Tuesday's child is full of grace, energetic stride, and clear intent.",
  Wednesday: "Wednesday's child is full of woe in old verse, yet sharp in wit and swift in learning.",
  Thursday: "Thursday's child has far to go — gifted with a traveler's curious heart.",
  Friday: "Friday's child is loving and giving, seeking beauty and community.",
  Saturday: "Saturday's child works hard for a living, rewarded with deep endurance and craft."
};

export function getLifeMetrics(year: number, month: number, day: number, isSouthernHemisphere: boolean = false): LifeMetrics {
  const birthDate = new Date(year, month - 1, day, 12, 0, 0);
  const today = new Date();

  const diffMs = today.getTime() - birthDate.getTime();
  const daysLived = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const hoursLived = daysLived * 24;
  const approximateHeartbeats = daysLived * 24 * 60 * 72; // Average 72 bpm
  const earthOrbits = Math.round((daysLived / 365.2425) * 10) / 10;
  const ageYears = Math.floor(daysLived / 365.2425);

  // Next birthday calculation
  let nextBday = new Date(today.getFullYear(), month - 1, day, 12, 0, 0);
  if (nextBday.getTime() < today.getTime()) {
    nextBday = new Date(today.getFullYear() + 1, month - 1, day, 12, 0, 0);
  }
  const daysUntilNextBirthday = Math.max(0, Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const weekdayBorn = birthDate.toLocaleDateString("en-US", { weekday: "long" });
  const weekdayLore = WEEKDAY_LORE[weekdayBorn] || "A day marked by the turning sphere.";

  // Season
  // Solstices and equinoxes approx: Mar 21, Jun 21, Sep 23, Dec 21
  let season = "Winter";
  if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) {
    season = isSouthernHemisphere ? "Autumn" : "Spring";
  } else if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) {
    season = isSouthernHemisphere ? "Winter" : "Summer";
  } else if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day < 21)) {
    season = isSouthernHemisphere ? "Spring" : "Autumn";
  } else {
    season = isSouthernHemisphere ? "Summer" : "Winter";
  }

  return {
    daysLived,
    hoursLived,
    approximateHeartbeats,
    earthOrbits,
    daysUntilNextBirthday,
    ageYears,
    weekdayBorn,
    weekdayLore,
    season,
  };
}

export function getBirthdayIdentity(year: number, month: number, day: number, isSouthernHemisphere: boolean = false): BirthdayIdentity {
  return {
    western: getWesternZodiac(month, day),
    chinese: getChineseZodiac(year, month, day),
    botanicals: BOTANICALS_DATA[month - 1] || BOTANICALS_DATA[0],
    birthstone: BIRTHSTONES_DATA[month - 1] || BIRTHSTONES_DATA[0],
    metrics: getLifeMetrics(year, month, day, isSouthernHemisphere),
  };
}
