/**
/**
 * Culture, Cinema, and Deep Sky Cosmos for BackToYourDay.
 * Integrates NASA APOD API + Curated Authentic Cinema Archive with live poster retrieval.
 */

export interface NasaApodData {
  title: string;
  date: string;
  explanation: string;
  imageUrl: string;
  hdUrl?: string;
  copyright?: string;
  isArchivalFallback: boolean;
  constellationFocus?: string;
}

export interface MovieItem {
  title: string;
  year: number;
  director: string;
  tagline?: string;
  posterUrl: string;
  wikiKey?: string;
}

export interface SongItem {
  title: string;
  artist: string;
  year: number;
  albumArt: string;
}

// Iconic fallback astronomical sky images for dates prior to June 1995 or APOD failures
const ARCHIVAL_COSMOS: { title: string; explanation: string; imageUrl: string; constellation: string }[] = [
  {
    title: "The Pillars of Creation (Eagle Nebula)",
    explanation: "Towering tendrils of cosmic gas and interstellar dust sculpted by stellar winds from newborn stars 6,500 light-years from Earth.",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80",
    constellation: "Serpens"
  },
  {
    title: "The Great Orion Nebula (M42)",
    explanation: "A colossal stellar nursery illuminated by the four massive stars of the Trapezium Cluster, shining through winter night skies.",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80",
    constellation: "Orion"
  },
  {
    title: "Andromeda Galaxy (M31)",
    explanation: "A majestic spiral galaxy comprising over one trillion stars, floating across 2.5 million light-years of silent space.",
    imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1600&q=80",
    constellation: "Andromeda"
  },
  {
    title: "The Carina Nebula & Mystic Mountain",
    explanation: "A hyperactive tempest of star formation erupting across 300 light-years of deep southern skies.",
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1600&q=80",
    constellation: "Carina"
  },
  {
    title: "The Helix Nebula: Eye of the Cosmos",
    explanation: "A dying star casts off glowing concentric envelopes of gas, leaving behind an incandescent white dwarf.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    constellation: "Aquarius"
  },
];

export async function fetchNasaApod(year: number, month: number, day: number): Promise<NasaApodData> {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const dateStr = `${year}-${mm}-${dd}`;

  // APOD started on June 16, 1995
  const apodStart = new Date("1995-06-16").getTime();
  const targetDate = new Date(`${dateStr}T12:00:00Z`).getTime();

  if (targetDate >= apodStart) {
    try {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        if (data.media_type === "image" && data.url) {
          return {
            title: data.title,
            date: data.date,
            explanation: data.explanation || "A celestial portrait captured by space and ground telescopes on this date.",
            imageUrl: data.hdurl || data.url,
            hdUrl: data.hdurl,
            copyright: data.copyright?.trim(),
            isArchivalFallback: false,
          };
        }
      }
    } catch {
      // Fallback below
    }
  }

  // Deterministic archival cosmos fallback
  const index = (month + day) % ARCHIVAL_COSMOS.length;
  const fallback = ARCHIVAL_COSMOS[index];

  return {
    title: fallback.title,
    date: dateStr,
    explanation: fallback.explanation,
    imageUrl: fallback.imageUrl,
    isArchivalFallback: true,
    constellationFocus: fallback.constellation,
  };
}

// Curated landmark cinema catalog by year / era
const CINEMA_DATABASE: Record<number, (Omit<MovieItem, "posterUrl"> & { posterFallback: string; wikiKey: string })[]> = {
  1969: [
    { title: "2001: A Space Odyssey", year: 1968, director: "Stanley Kubrick", wikiKey: "2001:_A_Space_Odyssey", posterFallback: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" },
    { title: "Easy Rider", year: 1969, director: "Dennis Hopper", wikiKey: "Easy_Rider", posterFallback: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
    { title: "Butch Cassidy and the Sundance Kid", year: 1969, director: "George Roy Hill", wikiKey: "Butch_Cassidy_and_the_Sundance_Kid", posterFallback: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
  ],
  1972: [
    { title: "The Godfather", year: 1972, director: "Francis Ford Coppola", wikiKey: "The_Godfather", posterFallback: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80" },
    { title: "Solaris", year: 1972, director: "Andrei Tarkovsky", wikiKey: "Solaris_(1972_film)", posterFallback: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    { title: "Cabaret", year: 1972, director: "Bob Fosse", wikiKey: "Cabaret_(1972_film)", posterFallback: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" },
  ],
  1977: [
    { title: "Star Wars", year: 1977, director: "George Lucas", wikiKey: "Star_Wars_(film)", posterFallback: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80" },
    { title: "Close Encounters of the Third Kind", year: 1977, director: "Steven Spielberg", wikiKey: "Close_Encounters_of_the_Third_Kind", posterFallback: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" },
    { title: "Annie Hall", year: 1977, director: "Woody Allen", wikiKey: "Annie_Hall", posterFallback: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80" },
  ],
  1982: [
    { title: "Blade Runner", year: 1982, director: "Ridley Scott", wikiKey: "Blade_Runner", posterFallback: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
    { title: "E.T. the Extra-Terrestrial", year: 1982, director: "Steven Spielberg", wikiKey: "E.T._the_Extra-Terrestrial", posterFallback: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    { title: "The Thing", year: 1982, director: "John Carpenter", wikiKey: "The_Thing_(1982_film)", posterFallback: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
  ],
  1989: [
    { title: "Dead Poets Society", year: 1989, director: "Peter Weir", wikiKey: "Dead_Poets_Society", posterFallback: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80" },
    { title: "Batman", year: 1989, director: "Tim Burton", wikiKey: "Batman_(1989_film)", posterFallback: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
    { title: "Back to the Future Part II", year: 1989, director: "Robert Zemeckis", wikiKey: "Back_to_the_Future_Part_II", posterFallback: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
  ],
  1994: [
    { title: "Pulp Fiction", year: 1994, director: "Quentin Tarantino", wikiKey: "Pulp_Fiction", posterFallback: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80" },
    { title: "The Shawshank Redemption", year: 1994, director: "Frank Darabont", wikiKey: "The_Shawshank_Redemption", posterFallback: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80" },
    { title: "The Lion King", year: 1994, director: "Roger Allers", wikiKey: "The_Lion_King_(1994_film)", posterFallback: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" },
  ],
  1999: [
    { title: "The Matrix", year: 1999, director: "The Wachowskis", wikiKey: "The_Matrix", posterFallback: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    { title: "Fight Club", year: 1999, director: "David Fincher", wikiKey: "Fight_Club", posterFallback: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
    { title: "American Beauty", year: 1999, director: "Sam Mendes", wikiKey: "American_Beauty_(1999_film)", posterFallback: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
  ],
  2001: [
    { title: "The Fellowship of the Ring", year: 2001, director: "Peter Jackson", wikiKey: "The_Lord_of_the_Rings:_The_Fellowship_of_the_Ring", posterFallback: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
    { title: "Spirited Away", year: 2001, director: "Hayao Miyazaki", wikiKey: "Spirited_Away", posterFallback: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" },
    { title: "Amélie", year: 2001, director: "Jean-Pierre Jeunet", wikiKey: "Amélie", posterFallback: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80" },
  ],
  2004: [
    { title: "Eternal Sunshine of the Spotless Mind", year: 2004, director: "Michel Gondry", wikiKey: "Eternal_Sunshine_of_the_Spotless_Mind", posterFallback: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80" },
    { title: "Spider-Man 2", year: 2004, director: "Sam Raimi", wikiKey: "Spider-Man_2", posterFallback: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
    { title: "The Incredibles", year: 2004, director: "Brad Bird", wikiKey: "The_Incredibles", posterFallback: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" },
  ],
  2008: [
    { title: "The Dark Knight", year: 2008, director: "Christopher Nolan", wikiKey: "The_Dark_Knight", posterFallback: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
    { title: "WALL-E", year: 2008, director: "Andrew Stanton", wikiKey: "WALL-E", posterFallback: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    { title: "Iron Man", year: 2008, director: "Jon Favreau", wikiKey: "Iron_Man_(2008_film)", posterFallback: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80" },
  ],
  2014: [
    { title: "Interstellar", year: 2014, director: "Christopher Nolan", wikiKey: "Interstellar_(film)", posterFallback: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80" },
    { title: "The Grand Budapest Hotel", year: 2014, director: "Wes Anderson", wikiKey: "The_Grand_Budapest_Hotel", posterFallback: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" },
    { title: "Whiplash", year: 2014, director: "Damien Chazelle", wikiKey: "Whiplash_(2014_film)", posterFallback: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80" },
  ],
  2021: [
    { title: "Dune", year: 2021, director: "Denis Villeneuve", wikiKey: "Dune_(2021_film)", posterFallback: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" },
    { title: "Everything Everywhere All at Once", year: 2022, director: "Daniels", wikiKey: "Everything_Everywhere_All_at_Once", posterFallback: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    { title: "Oppenheimer", year: 2023, director: "Christopher Nolan", wikiKey: "Oppenheimer_(film)", posterFallback: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80" },
  ],
};

// In-memory poster cache
const posterCache: Record<string, string> = {};

export async function fetchCinemaForYear(year: number): Promise<MovieItem[]> {
  const keys = Object.keys(CINEMA_DATABASE).map(Number).sort((a, b) => Math.abs(a - year) - Math.abs(b - year));
  const closestYear = keys[0] || 1999;
  const rawList = CINEMA_DATABASE[closestYear] || CINEMA_DATABASE[1999];

  const resolved = await Promise.all(
    rawList.map(async (m) => {
      if (posterCache[m.wikiKey]) {
        return {
          title: m.title,
          year: m.year,
          director: m.director,
          posterUrl: posterCache[m.wikiKey],
        };
      }
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${m.wikiKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data.thumbnail?.source) {
            posterCache[m.wikiKey] = data.thumbnail.source;
            return {
              title: m.title,
              year: m.year,
              director: m.director,
              posterUrl: data.thumbnail.source,
            };
          }
        }
      } catch {
        // use fallback
      }
      return {
        title: m.title,
        year: m.year,
        director: m.director,
        posterUrl: m.posterFallback,
      };
    })
  );

  return resolved;
}

// Curated iconic songs catalog by year / era
const MUSIC_DATABASE: Record<number, (Omit<SongItem, "albumArt"> & { wikiKey: string; fallbackArt: string })[]> = {
  1969: [
    { title: "Space Oddity", artist: "David Bowie", year: 1969, wikiKey: "Space_Oddity_(song)", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
    { title: "Come Together", artist: "The Beatles", year: 1969, wikiKey: "Come_Together", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Proud Mary", artist: "Creedence Clearwater Revival", year: 1969, wikiKey: "Proud_Mary", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
  ],
  1972: [
    { title: "Rocket Man", artist: "Elton John", year: 1972, wikiKey: "Rocket_Man_(song)", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Superstition", artist: "Stevie Wonder", year: 1972, wikiKey: "Superstition_(song)", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Ziggy Stardust", artist: "David Bowie", year: 1972, wikiKey: "Ziggy_Stardust_(song)", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  1977: [
    { title: "Hotel California", artist: "Eagles", year: 1977, wikiKey: "Hotel_California_(song)", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Stayin' Alive", artist: "Bee Gees", year: 1977, wikiKey: "Stayin%27_Alive", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Dreams", artist: "Fleetwood Mac", year: 1977, wikiKey: "Dreams_(Fleetwood_Mac_song)", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  1982: [
    { title: "Eye of the Tiger", artist: "Survivor", year: 1982, wikiKey: "Eye_of_the_Tiger", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Don't You Want Me", artist: "The Human League", year: 1981, wikiKey: "Don%27t_You_Want_Me", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Africa", artist: "Toto", year: 1982, wikiKey: "Africa_(Toto_song)", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  1989: [
    { title: "Like a Prayer", artist: "Madonna", year: 1989, wikiKey: "Like_a_Prayer_(song)", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Every Rose Has Its Thorn", artist: "Poison", year: 1988, wikiKey: "Every_Rose_Has_Its_Thorn", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Straight Up", artist: "Paula Abdul", year: 1989, wikiKey: "Straight_Up_(song)", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  1994: [
    { title: "Waterfalls", artist: "TLC", year: 1995, wikiKey: "Waterfalls_(TLC_song)", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Creep", artist: "Radiohead", year: 1993, wikiKey: "Creep_(Radiohead_song)", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Black Hole Sun", artist: "Soundgarden", year: 1994, wikiKey: "Black_Hole_Sun", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  1999: [
    { title: "...Baby One More Time", artist: "Britney Spears", year: 1999, wikiKey: "...Baby_One_More_Time_(song)", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "No Scrubs", artist: "TLC", year: 1999, wikiKey: "No_Scrubs", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Smooth", artist: "Santana ft. Rob Thomas", year: 1999, wikiKey: "Smooth_(song)", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  2001: [
    { title: "Crazy in Love", artist: "Beyoncé", year: 2003, wikiKey: "Crazy_in_Love", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "In da Club", artist: "50 Cent", year: 2003, wikiKey: "In_da_Club", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Fallin'", artist: "Alicia Keys", year: 2001, wikiKey: "Fallin%27", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  2004: [
    { title: "Yeah!", artist: "Usher ft. Lil Jon", year: 2004, wikiKey: "Yeah!_(Usher_song)", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Toxic", artist: "Britney Spears", year: 2004, wikiKey: "Toxic_(song)", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "Hey Ya!", artist: "OutKast", year: 2003, wikiKey: "Hey_Ya!", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  2008: [
    { title: "Viva la Vida", artist: "Coldplay", year: 2008, wikiKey: "Viva_la_Vida_(song)", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Single Ladies", artist: "Beyoncé", year: 2008, wikiKey: "Single_Ladies_(Put_a_Ring_on_It)", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "I Kissed a Girl", artist: "Katy Perry", year: 2008, wikiKey: "I_Kissed_a_Girl", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  2014: [
    { title: "Happy", artist: "Pharrell Williams", year: 2014, wikiKey: "Happy_(Pharrell_Williams_song)", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Shake It Off", artist: "Taylor Swift", year: 2014, wikiKey: "Shake_It_Off", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "All About That Bass", artist: "Meghan Trainor", year: 2014, wikiKey: "All_About_That_Bass", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
  2021: [
    { title: "Blinding Lights", artist: "The Weeknd", year: 2020, wikiKey: "Blinding_Lights", fallbackArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80" },
    { title: "Levitating", artist: "Dua Lipa", year: 2020, wikiKey: "Levitating_(song)", fallbackArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
    { title: "drivers license", artist: "Olivia Rodrigo", year: 2021, wikiKey: "Drivers_License_(song)", fallbackArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80" },
  ],
};

const songArtCache: Record<string, string> = {};

export async function fetchMusicForYear(year: number): Promise<SongItem[]> {
  const keys = Object.keys(MUSIC_DATABASE).map(Number).sort((a, b) => Math.abs(a - year) - Math.abs(b - year));
  const closestYear = keys[0] || 1999;
  const rawList = MUSIC_DATABASE[closestYear] || MUSIC_DATABASE[1999];

  const resolved = await Promise.all(
    rawList.map(async (s) => {
      if (songArtCache[s.wikiKey]) {
        return { title: s.title, artist: s.artist, year: s.year, albumArt: songArtCache[s.wikiKey] };
      }
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${s.wikiKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data.thumbnail?.source) {
            songArtCache[s.wikiKey] = data.thumbnail.source;
            return { title: s.title, artist: s.artist, year: s.year, albumArt: data.thumbnail.source };
          }
        }
      } catch {
        // use fallback
      }
      return { title: s.title, artist: s.artist, year: s.year, albumArt: s.fallbackArt };
    })
  );

  return resolved;
}

