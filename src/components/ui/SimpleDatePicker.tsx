import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONTH_NAMES } from "@/lib/almanac";
import { sound } from "@/lib/sound";

export interface SimpleDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export function SimpleDatePicker({
  value,
  onChange,
  minYear = 1920,
  maxYear = new Date().getFullYear(),
  className,
}: SimpleDatePickerProps) {
  const currentYear = value.getFullYear();
  const currentMonth = value.getMonth();
  const currentDay = value.getDate();

  // Calculate days in selected month and year
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  // Generate list of years (current year down to minYear)
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      arr.push(y);
    }
    return arr;
  }, [minYear, maxYear]);

  // Generate days 1 to daysInMonth
  const days = useMemo(() => {
    const arr: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(d);
    }
    return arr;
  }, [daysInMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sound.playTick();
    const newMonth = parseInt(e.target.value, 10);
    const maxDays = new Date(currentYear, newMonth + 1, 0).getDate();
    const clampedDay = Math.min(currentDay, maxDays);
    onChange(new Date(currentYear, newMonth, clampedDay, 12, 0, 0));
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sound.playTick();
    const newDay = parseInt(e.target.value, 10);
    onChange(new Date(currentYear, currentMonth, newDay, 12, 0, 0));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sound.playTick();
    const newYear = parseInt(e.target.value, 10);
    const maxDays = new Date(newYear, currentMonth + 1, 0).getDate();
    const clampedDay = Math.min(currentDay, maxDays);
    onChange(new Date(newYear, currentMonth, clampedDay, 12, 0, 0));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-full rounded-xl border border-surface-border bg-surface/90 p-3 sm:p-4 transition-colors duration-200 hover:border-foreground-dim/40",
        className
      )}
    >
      <div className="flex items-center justify-between px-0.5 mb-2.5 sm:mb-3">
        <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-widest text-accent flex items-center gap-1.5">
          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent" />
          Select Date of Record
        </span>
        <span className="text-[10px] sm:text-[11px] font-mono text-foreground-dim">
          1920 &ndash; {maxYear}
        </span>
      </div>

      <div className="grid grid-cols-[1.55fr_0.9fr_1.15fr] gap-1.5 sm:gap-2.5 items-end">
        {/* Month Selector */}
        <div className="relative group min-w-0">
          <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-foreground-muted mb-1 text-left px-0.5">
            Month
          </label>
          <div className="relative">
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              aria-label="Birth month"
              className="w-full appearance-none rounded-lg border border-surface-border bg-canvas hover:border-foreground-dim/50 pl-2 sm:pl-3 pr-5 sm:pr-7 py-2 sm:py-2.5 text-[16px] sm:text-sm font-semibold text-foreground tracking-tight transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer truncate"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx} className="bg-canvas text-foreground">
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted transition-transform group-hover:translate-y-[-40%]" />
          </div>
        </div>

        {/* Day Selector */}
        <div className="relative group min-w-0">
          <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-foreground-muted mb-1 text-left px-0.5">
            Day
          </label>
          <div className="relative">
            <select
              value={currentDay}
              onChange={handleDayChange}
              aria-label="Birth day"
              className="w-full appearance-none rounded-lg border border-surface-border bg-canvas hover:border-foreground-dim/50 pl-1.5 sm:pl-2.5 pr-4 sm:pr-6 py-2 sm:py-2.5 text-[16px] sm:text-sm font-semibold text-foreground tracking-tight transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              {days.map((d) => (
                <option key={d} value={d} className="bg-canvas text-foreground">
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted transition-transform group-hover:translate-y-[-40%]" />
          </div>
        </div>

        {/* Year Selector */}
        <div className="relative group min-w-0">
          <label className="block text-[10px] font-mono font-medium uppercase tracking-wider text-foreground-muted mb-1 text-left px-0.5">
            Year
          </label>
          <div className="relative">
            <select
              value={currentYear}
              onChange={handleYearChange}
              aria-label="Birth year"
              className="w-full appearance-none rounded-lg border border-surface-border bg-canvas hover:border-foreground-dim/50 pl-1.5 sm:pl-2.5 pr-4 sm:pr-6 py-2 sm:py-2.5 text-[16px] sm:text-sm font-semibold text-foreground tracking-tight transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-canvas text-foreground">
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted transition-transform group-hover:translate-y-[-40%]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
