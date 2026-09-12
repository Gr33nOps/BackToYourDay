import { useState } from "react";
import { motion } from "framer-motion";
import type { Entry } from "@/lib/onthisday";
import { personName, personDescription } from "@/lib/onthisday";
import { RevealImage } from "@/components/effects/RevealImage";
import { SectionHead } from "@/components/SectionHead";

const EASE = [0.22, 0.68, 0.32, 1] as const;

type Props = {
  title: string;
  note: string;
  entries: Entry[];
  yearLabel: string;
  variant: "births" | "deaths";
};

export function PeopleCards({ title, note, entries, yearLabel, variant }: Props) {
  return (
    <section className="mb-14">
      <SectionHead title={title} note={note} />
      {entries.length === 0 ? (
        <p className="italic text-muted">Nothing found for this day.</p>
      ) : (
        <div className="grid gap-4 sm:gap-[22px] md:grid-cols-3">
          {entries.map((entry, i) => (
            <PersonCard key={i} entry={entry} yearLabel={yearLabel} variant={variant} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

function PersonCard({
  entry,
  yearLabel,
  variant,
  index,
}: {
  entry: Entry;
  yearLabel: string;
  variant: "births" | "deaths";
  index: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const thumb = entry.pages?.[0]?.thumbnail?.source;
  const yearColor = variant === "deaths" ? "text-slateink" : "text-teal-deep";

  return (
    <motion.article
      className="flex flex-col overflow-hidden rounded-md border border-line bg-card shadow-sm transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-md"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.08, duration: 0.5, ease: EASE }}
    >
      {thumb && !imageFailed && (
        <RevealImage
          src={thumb}
          alt=""
          onError={() => setImageFailed(true)}
          className="block h-[200px] w-full bg-paper-deep object-cover sm:h-[220px] md:h-[200px]"
        />
      )}
      <div className="flex flex-1 flex-col gap-[3px] p-[16px_18px_20px]">
        <h4 className="m-0 font-display text-[1.2rem] font-semibold leading-[1.25]">
          {personName(entry)}
        </h4>
        <p
          className={`m-0 mb-2 mt-0.5 text-[0.78rem] font-bold uppercase tracking-[0.06em] ${yearColor}`}
        >
          {yearLabel} {entry.year}
        </p>
        <p className="m-0 text-[0.92rem] leading-[1.5] text-muted">{personDescription(entry)}</p>
      </div>
    </motion.article>
  );
}
