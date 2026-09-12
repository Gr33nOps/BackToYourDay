import { motion } from "framer-motion";
import type { BirthdayProfile as Profile } from "@/lib/zodiac";

export function BirthdayProfile({ profile }: { profile: Profile }) {
  const { sign, birthstone, birthFlower } = profile;

  return (
    <section className="mb-14">
      <motion.div
        className="grid items-center gap-x-9 gap-y-3 rounded-lg border border-line p-[28px_30px] shadow-sm md:grid-cols-[1.5fr_1fr]"
        style={{
          background:
            "linear-gradient(135deg, rgba(184,80,42,0.07), rgba(47,125,120,0.06))",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.68, 0.32, 1] }}
      >
        <div className="flex items-center gap-5">
          <span
            className="grid h-[76px] w-[76px] flex-none place-items-center rounded-full border-2 border-terracotta bg-card text-[2.6rem] leading-none text-terracotta shadow-[inset_0_0_0_5px_rgba(184,80,42,0.08)]"
            aria-hidden
          >
            {sign.symbol + "︎"}
          </span>
          <div>
            <p className="mb-0.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">
              Your star sign
            </p>
            <h3 className="m-0 font-display text-[1.9rem] font-semibold leading-[1.05]">
              {sign.name}
            </h3>
            <p className="mt-1 text-[0.9rem] text-muted">
              {sign.dates} &middot; {sign.element} sign
            </p>
            <p className="mt-2 font-semibold text-terracotta-deep">{sign.traits}</p>
          </div>
        </div>

        <dl className="m-0 grid content-center">
          <Fact label="Birthstone" value={birthstone} border />
          <Fact label="Birth flower" value={birthFlower} />
        </dl>
      </motion.div>
    </section>
  );
}

function Fact({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div
      className={
        "flex items-baseline justify-between gap-4 py-[13px] " +
        (border ? "border-b border-dashed border-line" : "")
      }
    >
      <dt className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className="m-0 text-right font-display text-[1.3rem] font-semibold text-ink">{value}</dd>
    </div>
  );
}
