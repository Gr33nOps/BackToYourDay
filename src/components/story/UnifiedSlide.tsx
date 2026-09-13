import { Copy, Share2 } from "lucide-react";
import { useState } from "react";
import type { BirthdayIdentity } from "@/lib/almanac";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import type { HistoricalWeather } from "@/lib/weather";
import type { MovieItem, NasaApodData, SongItem } from "@/lib/culture";
import { reduceSlideDetails } from "@/lib/story";
import { ZodiacGlyph } from "@/components/visuals/ZodiacGlyph";
import { GemstoneVisual } from "@/components/visuals/GemstoneVisual";
import { BotanicalVisual } from "@/components/visuals/BotanicalVisual";
import { MoonVisual } from "@/components/visuals/MoonVisual";

type Props = { index: number; date: Date; identity: BirthdayIdentity; moon: MoonPhaseInfo; weather: HistoricalWeather; sky: NasaApodData; movies: MovieItem[]; songs: SongItem[]; onReset: () => void };
type Slide = { label: string; title: string; facts: [string, string][]; visual: React.ReactNode };

export function UnifiedSlide({ index, date, identity, moon, weather, sky, movies, songs, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const dateLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
  const copy = async () => { await navigator.clipboard?.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  const share = async () => { if (navigator.share) await navigator.share({ title: `BackToYourDay · ${dateLabel}`, url: window.location.href }); else await copy(); };
  const slides: Slide[] = [
    { label: identity.metrics.weekdayBorn, title: dateLabel, facts: [["Season", identity.metrics.season], ["The story begins", "Here"]], visual: <span className="slide-number">{date.getDate()}</span> },
    { label: "Your sun sign", title: identity.western.name, facts: [["Element", identity.western.element], ["Season", identity.western.dates]], visual: <ZodiacGlyph sign={identity.western.name} size={250} /> },
    { label: "Birthstone", title: identity.birthstone.primary, facts: [["Alternate", identity.birthstone.alternate ?? "—"], ["Month", date.toLocaleString("en-US", { month: "long" })]], visual: <GemstoneVisual name={identity.birthstone.primary} colorHex={identity.birthstone.colorHex} size={250} /> },
    { label: "Birth flower", title: identity.botanicals.primary.name, facts: [["Companion", identity.botanicals.secondary.name], ["Meaning", identity.botanicals.primary.meaning]], visual: <BotanicalVisual name={identity.botanicals.primary.name} size={250} /> },
    { label: "The moon", title: moon.phaseName, facts: [["Illuminated", `${moon.illumination}%`], ["Age", `${moon.ageDays} days`]], visual: <MoonVisual phaseFraction={moon.phaseFraction} isWaxing={moon.isWaxing} illumination={moon.illumination} size={250} /> },
    { label: weather.locationName, title: `${Math.round(weather.maxTempC)}°`, facts: [["Conditions", weather.condition], ["Daylight", `${weather.daylightHours} hours`]], visual: <span className="slide-weather">{weather.iconType === "rain" ? "☂" : weather.iconType === "snow" ? "✳" : "☀"}</span> },
    { label: "The sky above", title: sky.title, facts: [["Captured", sky.date], ["Archive", sky.copyright ?? "NASA / APOD"]], visual: <img src={sky.imageUrl} alt={sky.title} className="slide-image" /> },
    { label: `Cinema · ${date.getFullYear()}`, title: "On screen", facts: [["A year in film", `${movies.length} selected titles`], ["Theater lights", "Down"]], visual: <div className="slide-strip">{movies.slice(0, 3).map((movie) => <img key={movie.title} src={movie.posterUrl} alt={`${movie.title} poster`} />)}</div> },
    { label: `Music · ${date.getFullYear()}`, title: "On repeat", facts: [["A year in sound", `${songs.length} selected tracks`], ["Turntable", "Spinning"]], visual: <div className="slide-strip square">{songs.slice(0, 3).map((song) => <img key={song.title} src={song.albumArt} alt={`${song.title} album art`} />)}</div> },
    { label: "Your time so far", title: `${identity.metrics.daysLived.toLocaleString()} days`, facts: [["Hours", identity.metrics.hoursLived.toLocaleString()], ["Next birthday", identity.metrics.daysUntilNextBirthday === 0 ? "Today" : `${identity.metrics.daysUntilNextBirthday} days`]], visual: <span className="slide-number">{identity.metrics.ageYears}</span> },
    { label: "Your capsule", title: "Keep this day.", facts: [["Sign", identity.western.name], ["Moon", moon.phaseName]], visual: <div className="slide-actions"><button onClick={share} className="slide-primary"><Share2 aria-hidden="true" /> Share</button><button onClick={copy} className="slide-quiet"><Copy aria-hidden="true" /> {copied ? "Copied" : "Copy link"}</button><button onClick={onReset} className="slide-quiet">Another date</button></div> },
  ];
  const slide = slides[index];
  return <article className="visual-slide"><div className="visual-slide__art">{slide.visual}</div><div className="visual-slide__caption"><p>{slide.label}</p><h1>{slide.title}</h1><dl>{reduceSlideDetails(slide.facts).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div></article>;
}
