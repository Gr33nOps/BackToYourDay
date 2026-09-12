import { motion } from "framer-motion";
import { MONTH_NAMES, getProfile } from "@/lib/zodiac";
import { wikipediaDateUrl, type Entry } from "@/lib/onthisday";
import { WordReveal } from "@/components/effects/WordReveal";
import { BirthdayProfile } from "@/components/BirthdayProfile";
import { EventTimeline } from "@/components/EventTimeline";
import { PeopleCards } from "@/components/PeopleCards";

type Props = {
  month: number;
  day: number;
  events: Entry[];
  births: Entry[];
  deaths: Entry[];
  onAgain: () => void;
};

export function Results({ month, day, events, births, deaths, onAgain }: Props) {
  const dateLabel = `${MONTH_NAMES[month - 1]} ${day}`;
  const profile = getProfile(month, day);

  return (
    <div>
      <div className="mx-0 mb-[46px] mt-[clamp(28px,6vh,56px)] text-center">
        <p className="mb-2.5 text-[0.74rem] font-bold uppercase tracking-[0.22em] text-teal-deep">
          You&rsquo;ve arrived on
        </p>
        <h2 className="m-0 font-display text-[clamp(2.4rem,8vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          <WordReveal text={dateLabel} delay={0.1} />
        </h2>
        <motion.p
          className="mt-3 font-display text-[1.15rem] italic text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Here&rsquo;s what makes this day yours.
        </motion.p>
      </div>

      <BirthdayProfile profile={profile} />

      <EventTimeline events={events} />

      <PeopleCards
        title="Who was born"
        note="You share a birthday with these people."
        entries={births}
        yearLabel="Born"
        variant="births"
      />

      <PeopleCards
        title="Who we lost"
        note="Remembered on this date."
        entries={deaths}
        yearLabel="Died"
        variant="deaths"
      />

      <div className="mb-6 rounded-md border border-dashed border-line bg-paper-deep p-[36px_22px] text-center">
        <p className="mb-[18px] font-display text-[1.5rem] font-semibold">Fancy another trip?</p>
        <button
          type="button"
          onClick={onAgain}
          className="min-w-[220px] rounded-sm border-2 border-terracotta bg-transparent px-6 py-3.5 text-[1.05rem] font-semibold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-[#fff9f2]"
        >
          Pick another day
        </button>
      </div>

      <p className="text-center text-[0.86rem] text-muted">
        Source: Wikipedia.{" "}
        <a
          href={wikipediaDateUrl(month, day)}
          target="_blank"
          rel="noopener"
          className="font-semibold text-teal-deep no-underline [border-bottom:1.5px_solid_rgba(35,93,89,0.35)] transition-colors hover:border-teal hover:text-teal"
        >
          See this date in full
        </a>
      </p>
    </div>
  );
}
