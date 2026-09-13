import { Copy, Share2 } from "lucide-react";
import { useState } from "react";
import type { BirthdayIdentity } from "@/lib/almanac";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import type { HistoricalWeather } from "@/lib/weather";
import type { MovieItem, NasaApodData, SongItem } from "@/lib/culture";
import { ZodiacGlyph } from "@/components/visuals/ZodiacGlyph";
import { GemstoneVisual } from "@/components/visuals/GemstoneVisual";
import { BotanicalVisual } from "@/components/visuals/BotanicalVisual";
import { MoonVisual } from "@/components/visuals/MoonVisual";

type Props = {
  index: number;
  date: Date;
  identity: BirthdayIdentity;
  moon: MoonPhaseInfo;
  weather: HistoricalWeather;
  sky: NasaApodData;
  movies: MovieItem[];
  songs: SongItem[];
  onReset: () => void;
};

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 border-l border-white/10 pl-3"><dt>{label}</dt><dd>{value}</dd></div>;
}

export function UnifiedSlide({ index, date, identity, moon, weather, sky, movies, songs, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const formattedDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
  const copy = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const share = async () => {
    if (navigator.share) await navigator.share({ title: `BackToYourDay · ${formattedDate}`, url: window.location.href });
    else await copy();
  };

  const slides = [
    { eyebrow: "The date", title: formattedDate, body: `A ${identity.metrics.weekdayBorn}. Here’s the world that was waiting when your story began.`, details: [["Season", identity.metrics.season], ["Sun sign", identity.western.name], ["Chinese year", identity.chinese.animal]], art: <span className="text-[clamp(7rem,20vw,16rem)] font-display font-black leading-none text-accent">{date.getDate()}</span> },
    { eyebrow: "Your sun sign", title: identity.western.name, body: `${identity.western.element} energy, born under ${identity.western.dates}.`, details: [["Element", identity.western.element], ["Symbol", identity.western.symbol], ["Motto", identity.western.latinMotto]], art: <ZodiacGlyph sign={identity.western.name} size={220} /> },
    { eyebrow: "Birthstone", title: identity.birthstone.primary, body: identity.birthstone.lore, details: [["Color", identity.birthstone.colorHex], ["Month", date.toLocaleString("en-US", { month: "long" })], ["Alternate", identity.birthstone.alternate ?? "—"]], art: <GemstoneVisual name={identity.birthstone.primary} colorHex={identity.birthstone.colorHex} size={220} /> },
    { eyebrow: "Birth flower", title: identity.botanicals.primary.name, body: identity.botanicals.primary.meaning, details: [["Season", identity.metrics.season], ["Meaning", identity.botanicals.primary.meaning], ["Companion", identity.botanicals.secondary.name]], art: <BotanicalVisual name={identity.botanicals.primary.name} size={220} /> },
    { eyebrow: "The moon", title: moon.phaseName, body: `The moon was ${moon.illumination}% illuminated — a quiet marker in the same sky above you.`, details: [["Illumination", `${moon.illumination}%`], ["Age", `${moon.ageDays} days`], ["Direction", moon.isWaxing ? "Waxing" : "Waning"]], art: <MoonVisual phaseFraction={moon.phaseFraction} isWaxing={moon.isWaxing} illumination={moon.illumination} size={220} /> },
    { eyebrow: `Weather in ${weather.locationName}`, title: weather.condition, body: weather.summary, details: [["High", `${Math.round(weather.maxTempC)}°C`], ["Low", `${Math.round(weather.minTempC)}°C`], ["Daylight", `${weather.daylightHours} hours`]], art: <span className="font-display text-[clamp(6rem,18vw,13rem)] font-black leading-none text-accent">{Math.round(weather.maxTempC)}°</span> },
    { eyebrow: "Above the world", title: sky.title, body: sky.explanation, details: [["Captured", sky.date], ["Credit", sky.copyright ?? "NASA / APOD"], ["Sky", sky.constellationFocus ?? "Deep space"]], art: <img src={sky.imageUrl} alt={sky.title} className="h-56 w-full max-w-md rounded-2xl object-cover shadow-2xl sm:h-72" /> },
    { eyebrow: `On screen in ${date.getFullYear()}`, title: "Cinema had its moment.", body: "Three films that helped define the atmosphere around your first year.", details: [["Year", String(date.getFullYear())], ["Selection", `${movies.length} films`], ["Format", "Theatrical release"]], art: <div className="grid w-full max-w-md grid-cols-3 gap-3">{movies.slice(0, 3).map((movie) => <img key={movie.title} src={movie.posterUrl} alt={`${movie.title} poster`} className="aspect-[2/3] w-full rounded-xl object-cover shadow-xl" />)}</div> },
    { eyebrow: `On repeat in ${date.getFullYear()}`, title: "The soundtrack.", body: "These songs carry some of the texture of the year you arrived.", details: [["Year", String(date.getFullYear())], ["Selection", `${songs.length} tracks`], ["Format", "Chart moments"]], art: <div className="grid w-full max-w-md grid-cols-3 gap-3">{songs.slice(0, 3).map((song) => <img key={song.title} src={song.albumArt} alt={`${song.title} album art`} className="aspect-square w-full rounded-xl object-cover shadow-xl" />)}</div> },
    { eyebrow: "Life in numbers", title: `${identity.metrics.daysLived.toLocaleString()} days`, body: "Every day since then has been part of the same unfolding record.", details: [["Weeks", Math.floor(identity.metrics.daysLived / 7).toLocaleString()], ["Hours", identity.metrics.hoursLived.toLocaleString()], ["Next birthday", identity.metrics.daysUntilNextBirthday === 0 ? "Today" : `${identity.metrics.daysUntilNextBirthday} days`]], art: <span className="font-display text-[clamp(5rem,16vw,12rem)] font-black leading-none text-accent">{identity.metrics.ageYears}</span> },
    { eyebrow: "Your capsule", title: "Keep the date close.", body: "A small portrait of where the sky, culture and calendar met on your day.", details: [["Sign", identity.western.name], ["Moon", moon.phaseName], ["Flower", identity.botanicals.primary.name]], art: <div className="flex flex-col items-center gap-3"><button onClick={share} className="capsule-button"><Share2 className="h-4 w-4" aria-hidden="true" /> Share your capsule</button><button onClick={copy} className="capsule-link"><Copy className="h-3.5 w-3.5" aria-hidden="true" /> {copied ? "Link copied" : "Copy link"}</button><button onClick={onReset} className="capsule-link">Choose another date</button></div> },
  ];
  const slide = slides[index];
  return <article className="capsule-slide"><div className="capsule-copy"><p className="capsule-eyebrow">{slide.eyebrow}</p><h1>{slide.title}</h1><p className="capsule-body">{slide.body}</p><dl className="capsule-details">{slide.details.map(([label, value]) => <Detail key={label} label={label} value={value} />)}</dl></div><div className="capsule-art">{slide.art}</div></article>;
}
