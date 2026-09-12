export type Sign = {
  name: string;
  symbol: string;
  element: string;
  traits: string;
  dates: string;
  start: [number, number];
  end: [number, number];
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ZODIAC: Sign[] = [
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
  { name: "Sagittarius", symbol: "♐", element: "Fire",  traits: "Adventurous · Honest · Optimistic",    dates: "Nov 22 – Dec 21", start: [11, 22], end: [12, 21] },
];

export const BIRTHSTONES = [
  "Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl",
  "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise",
];

export const BIRTH_FLOWERS = [
  "Carnation", "Violet", "Daffodil", "Daisy", "Lily of the valley", "Rose",
  "Larkspur", "Gladiolus", "Aster", "Marigold", "Chrysanthemum", "Narcissus",
];

export function getZodiac(month: number, day: number): Sign {
  for (const sign of ZODIAC) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    const afterStart = month > sm || (month === sm && day >= sd);
    const beforeEnd = month < em || (month === em && day <= ed);
    if (sm <= em ? afterStart && beforeEnd : afterStart || beforeEnd) {
      return sign;
    }
  }
  return ZODIAC[0];
}

export type BirthdayProfile = {
  sign: Sign;
  birthstone: string;
  birthFlower: string;
};

export function getProfile(month: number, day: number): BirthdayProfile {
  return {
    sign: getZodiac(month, day),
    birthstone: BIRTHSTONES[month - 1],
    birthFlower: BIRTH_FLOWERS[month - 1],
  };
}
