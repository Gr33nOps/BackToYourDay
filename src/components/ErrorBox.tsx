import { motion } from "framer-motion";

export function ErrorBox({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      role="alert"
      className="mx-auto my-12 max-w-[460px] rounded-md border border-line bg-card p-[34px_28px] text-center shadow-md"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.68, 0.32, 1] }}
    >
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/[0.12] font-display text-[1.6rem] font-bold text-terracotta-deep">
        !
      </div>
      <p className="mb-5 text-muted">
        The time machine hit a snag and couldn&rsquo;t reach that day. Mind trying once more?
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-[52px] w-full rounded-sm bg-terracotta px-6 text-[1.05rem] font-semibold text-[#fff9f2] transition-[background,transform] hover:bg-terracotta-deep active:translate-y-px"
      >
        Try again
      </button>
    </motion.div>
  );
}
