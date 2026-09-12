import { motion } from "framer-motion";
import type { Entry } from "@/lib/onthisday";
import { SectionHead } from "@/components/SectionHead";

const EASE = [0.22, 0.68, 0.32, 1] as const;

export function EventTimeline({ events }: { events: Entry[] }) {
  return (
    <section className="mb-14">
      <SectionHead title="What happened" note="Moments from this date across the years." />

      {events.length === 0 ? (
        <p className="italic text-muted">Nothing found for this day.</p>
      ) : (
        <ul className="relative m-0 list-none p-0">
          <span className="absolute left-[9px] top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-line to-line-soft" />
          {events.map((event, i) => {
            const page = event.pages?.[0];
            const href = page?.content_urls?.desktop?.page;
            return (
              <motion.li
                key={i}
                className="relative pb-[26px] pl-10 last:pb-0"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.08, duration: 0.5, ease: EASE }}
              >
                <span className="absolute left-[3px] top-[7px] h-3.5 w-3.5 rounded-full border-[3px] border-terracotta bg-card shadow-[0_0_0_4px_var(--paper)]" />
                <span className="mb-1 block font-display text-[1.35rem] font-semibold leading-[1.1] text-terracotta-deep">
                  {event.year}
                </span>
                <p className="m-0 mb-2 max-w-[62ch]">{event.text}</p>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className="text-[0.9rem] font-semibold text-teal-deep no-underline [border-bottom:1.5px_solid_rgba(35,93,89,0.35)] transition-colors hover:border-teal hover:text-teal"
                  >
                    Read more on Wikipedia
                  </a>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
