"use client";

import { useMemo, useState } from "react";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";

import { cn } from "@/lib/utils/cn";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  MobileOverlay,
  MobileOverlayBody,
  MobileOverlayClose,
  MobileOverlayContent,
  MobileOverlayFooter,
  MobileOverlayHeader,
  MobileOverlayTitle,
} from "./mobile-overlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type MonthYearPickerProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minYear?: number;
  maxYear?: number;
  includePresentOption?: boolean;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseMonthYear(
  value?: string
): { month: number; year: number } | null {
  if (!value) return null;

  const match = value.match(/^(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const month = Number(match[1]);
  const year = Number(match[2]);
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(year)) return null;

  return { month, year };
}

function formatMonthYear(month: number, year: number): string {
  return `${String(month).padStart(2, "0")}/${year}`;
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select month and year",
  disabled = false,
  className,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
  includePresentOption = false,
}: MonthYearPickerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);

  const now = new Date();
  const parsed = parseMonthYear(value);

  const [draftMonth, setDraftMonth] = useState<number>(
    parsed?.month ?? now.getMonth() + 1
  );
  const [draftYear, setDraftYear] = useState<number>(
    parsed?.year ?? now.getFullYear()
  );

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y -= 1) {
      list.push(y);
    }
    return list;
  }, [maxYear, minYear]);

  const initializeDraft = () => {
    const current = parseMonthYear(value);
    const fallbackYear = now.getFullYear();
    const fallbackMonth = now.getMonth() + 1;
    const nextYear = current?.year ?? fallbackYear;

    setDraftMonth(current?.month ?? fallbackMonth);
    setDraftYear(Math.min(Math.max(nextYear, minYear), maxYear));
  };

  const applySelection = () => {
    onChange(formatMonthYear(draftMonth, draftYear));
    setOpen(false);
  };

  const shiftYear = (delta: number) => {
    setDraftYear((prev) => Math.min(Math.max(prev + delta, minYear), maxYear));
  };

  const panel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => shiftYear(-1)}
          disabled={draftYear <= minYear}
          aria-label="Previous year"
        >
          <ChevronLeft />
        </Button>

        <Select
          value={String(draftYear)}
          onValueChange={(nextValue) => setDraftYear(Number(nextValue))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => shiftYear(1)}
          disabled={draftYear >= maxYear}
          aria-label="Next year"
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {MONTHS.map((month, index) => {
          const monthNumber = index + 1;
          const active = draftMonth === monthNumber;
          return (
            <Button
              key={month}
              type="button"
              variant={active ? "default" : "outline"}
              className="h-10"
              onClick={() => setDraftMonth(monthNumber)}
            >
              {month}
            </Button>
          );
        })}
      </div>

      {includePresentOption ? (
        <Button
          type="button"
          variant={value === "Present" ? "default" : "outline"}
          className="w-full"
          onClick={() => {
            onChange("Present");
            setOpen(false);
          }}
        >
          Present
        </Button>
      ) : null}
    </div>
  );

  const trigger = (
    <button
      type="button"
      onClick={() => {
        initializeDraft();
        setOpen(true);
      }}
      disabled={disabled}
      className={cn(
        "border-input text-left dark:bg-input/30 h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "flex items-center justify-between gap-2",
        className
      )}
    >
      <span className={cn(!value && "text-muted-foreground")}>
        {value || placeholder}
      </span>
      <CalendarDays className="text-muted-foreground size-4" />
    </button>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <MobileOverlay open={open} onOpenChange={setOpen}>
          <MobileOverlayContent>
            <MobileOverlayHeader>
              <MobileOverlayTitle>Pick month and year</MobileOverlayTitle>
            </MobileOverlayHeader>
            <MobileOverlayBody>{panel}</MobileOverlayBody>
            <MobileOverlayFooter className="space-y-2">
              <Button type="button" onClick={applySelection} size="lg" className="w-full">
                Select
              </Button>
              <MobileOverlayClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                  size="lg"
                  className="w-full"
                >
                  Close
                </Button>
              </MobileOverlayClose>
            </MobileOverlayFooter>
          </MobileOverlayContent>
        </MobileOverlay>
      </>
    );
  }

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pick month and year</DialogTitle>
          </DialogHeader>
          {panel}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <Button type="button" onClick={applySelection}>
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
