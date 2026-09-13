import { motion } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";

export function ErrorBox({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      role="alert"
      className="mx-auto my-12 max-w-md border border-surface-border bg-surface p-8 text-center shadow-2xl"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.68, 0.32, 1] }}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-accent/20 bg-accent/10 text-accent">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-display font-bold text-lg text-white mb-2">
        Archive Retrieval Interrupted
      </h3>
      <p className="mb-6 text-foreground-muted text-sm leading-relaxed">
        We could not retrieve historical ledger data for that specified date. Verify connectivity and re-query.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-accent text-black font-mono font-semibold uppercase tracking-wider text-xs hover:bg-accent-hover transition-all cursor-pointer shadow-lg"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Re-Query Archive</span>
      </button>
    </motion.div>
  );
}
