"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  placeholder?: string;
  className?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function DatePicker({
  value,
  onChange,
  name,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Parse value
  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1);

  const days: (number | null)[] = [];
  for (let i = firstDay - 1; i >= 0; i--) days.push(prevMonthDays - i);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  while (days.length % 7 !== 0) days.push(null);

  const isToday = (d: number) =>
    d === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const isSelected = (d: number) =>
    selectedDate &&
    d === selectedDate.getDate() &&
    viewMonth === selectedDate.getMonth() &&
    viewYear === selectedDate.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDate = (day: number) => {
    onChange?.(formatDate(viewYear, viewMonth, day));
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={value || ""} />}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm outline-none transition-all",
          open ? "border-white/20 bg-white/[0.06]" : "",
          displayValue ? "text-white" : "text-white/40"
        )}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <Calendar className="h-4 w-4 shrink-0 text-white/30" />
      </button>

      {/* Calendar dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute left-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#111111]/95 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold text-white">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0 px-3">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-white/25">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0 px-3 pb-3">
              {days.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const inMonth =
                  (i >= firstDay && i < firstDay + daysInMonth) ||
                  (i < firstDay);
                const isCurrentMonth =
                  i >= firstDay && i < firstDay + daysInMonth;

                return (
                  <button
                    key={`day-${i}`}
                    type="button"
                    onClick={() => {
                      if (!isCurrentMonth) {
                        // Navigate to other month
                        if (i < firstDay) prevMonth();
                        else nextMonth();
                        setTimeout(() => selectDate(day), 100);
                      } else {
                        selectDate(day);
                      }
                    }}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all duration-150",
                      !isCurrentMonth && "text-white/15",
                      isCurrentMonth && !isToday(day) && !isSelected(day) && "text-white/70 hover:bg-white/[0.08] hover:text-white",
                      isToday(day) && !isSelected(day) && "bg-white/[0.1] text-white font-medium",
                      isSelected(day) && "bg-brand-primary text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
              <button
                type="button"
                onClick={() => {
                  onChange?.("");
                  setOpen(false);
                }}
                className="text-xs text-white/30 transition-colors hover:text-white/60"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewYear(today.getFullYear());
                  setViewMonth(today.getMonth());
                  onChange?.(formatDate(today.getFullYear(), today.getMonth(), today.getDate()));
                  setOpen(false);
                }}
                className="text-xs font-medium text-brand-primary transition-colors hover:text-white"
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
