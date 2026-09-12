export function SectionHead({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-[26px] flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5 border-b-2 border-line pb-3.5">
      <h3 className="m-0 font-display text-[1.6rem] font-semibold tracking-[-0.01em]">{title}</h3>
      <p className="m-0 text-[0.92rem] text-muted">{note}</p>
    </div>
  );
}
