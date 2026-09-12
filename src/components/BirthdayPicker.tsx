import { useState } from "react";
import { motion } from "framer-motion";
import { MONTH_NAMES } from "@/lib/zodiac";
import { CursorTrail } from "@/components/effects/CursorTrail";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const selectClass =
  "w-full min-h-[52px] appearance-none rounded-sm border-[1.5px] border-line bg-[#fffefb] " +
  "px-4 pr-10 text-base text-ink cursor-pointer transition-colors hover:border-[#d4c19c] " +
  "focus-visible:border-teal";

type Props = {
  onSubmit: (month: number, day: number) => void;
};

export function BirthdayPicker({ onSubmit }: Props) {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!month || !day) return;
    onSubmit(Number(month), Number(day));
  }

  return (
    <motion.header
      className="relative mx-auto mt-[clamp(28px,8vh,72px)] mb-2 max-w-[660px] text-center"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.68, 0.32, 1] }}
    >
      <CursorTrail />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/25 bg-terracotta/[0.09] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-terracotta-deep">
          <span className="h-[7px] w-[7px] rounded-full bg-terracotta" />
          Est. any year you like
        </span>

        <h1 className="mx-auto mt-4 mb-3.5 font-display text-[clamp(2.6rem,8vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
          Back<span className="italic font-medium text-terracotta">To</span>YourDay
        </h1>

        <p className="mx-auto mb-7 max-w-[34ch] text-[1.12rem] leading-[1.55] text-muted">
          Choose your birthday and travel back to the day itself &mdash; the news, the
          arrivals, the farewells, straight from the pages of history.
        </p>

        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border border-line bg-card p-[30px_26px_26px] text-left shadow-lg"
        >
          <span className="pointer-events-none absolute left-[-11px] top-1/2 hidden h-5 w-5 -translate-y-1/2 rounded-full border border-line bg-paper sm:block" />
          <span className="pointer-events-none absolute right-[-11px] top-1/2 hidden h-5 w-5 -translate-y-1/2 rounded-full border border-line bg-paper sm:block" />

          <p className="mb-4 font-display text-[1.18rem] font-semibold text-ink">
            Set the dial to your birthday
          </p>

          <div className="mb-[18px] flex flex-col gap-3 sm:flex-row sm:gap-3.5">
            <label className="flex flex-1 flex-col gap-[7px]">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-muted">
                Month
              </span>
              <div className="relative">
                <select
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Month
                  </option>
                  {MONTH_NAMES.map((name, i) => (
                    <option key={name} value={i + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </label>

            <label className="flex flex-1 flex-col gap-[7px]">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-muted">
                Day
              </span>
              <div className="relative">
                <select
                  required
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Day
                  </option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="group flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-sm bg-terracotta px-6 text-[1.05rem] font-semibold text-[#fff9f2] shadow-[0_12px_24px_-14px_rgba(184,80,42,0.9)] transition-[background,transform] hover:bg-terracotta-deep active:translate-y-px"
          >
            <span>Take me back</span>
            <span className="transition-transform group-hover:translate-x-[5px]" aria-hidden>
              &rarr;
            </span>
          </button>
        </form>

        <p className="mt-5 text-[0.85rem] text-muted">
          Powered by Wikipedia&rsquo;s record of every day.
        </p>
      </div>
    </motion.header>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
