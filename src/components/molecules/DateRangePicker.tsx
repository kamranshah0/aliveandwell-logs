"use client";

import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  startOfMonth,
  endOfMonth,
  subDays,
  startOfYear,
  endOfYear,
  subMonths,
  startOfQuarter,
  endOfQuarter,
  format,
} from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Calendar1 } from "lucide-react";

// ✅ Props le raha hai taake external buttons se bhi control ho sake
interface Props {
  from: Date | null;
  to: Date | null;
  setFrom: (date: Date | null) => void;
  setTo: (date: Date | null) => void;
}

export default function DateRangePicker({
  from,
  to,
  setFrom,
  setTo,
}: Props) {
  const [open, setOpen] = React.useState(false);

  // ✅ Quick Filters
  const quickFilters = [
    {
      label: "Last 7 Days",
      getRange: () => [subDays(new Date(), 6), new Date()] as const,
    },
    {
      label: "This Month",
      getRange: () => [
        startOfMonth(new Date()),
        endOfMonth(new Date()),
      ] as const,
    },
    {
      label: "This Year",
      getRange: () => [
        startOfYear(new Date()),
        endOfYear(new Date()),
      ] as const,
    },
  ];

  // ✅ Quick Filter Apply
  const applyQuickFilter = ([f, t]: readonly [Date, Date]) => {
    setFrom(f);
    setTo(t);
  };

  // ✅ Clear Selection
  const handleClear = () => {
    setFrom(null);
    setTo(null);
    setOpen(false);
  };

  // ✅ Confirm Selection
  const handleOk = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <PopoverTrigger asChild>
        <Button
          size="sm"
          className="bg-side-panel hover:bg-surface-2 text-text-med-em text-xs gap-2"
        >
          {from && to
            ? `${format(from, "MMM dd, yyyy")} - ${format(
                to,
                "MMM dd, yyyy"
              )}`
            : "Date - End Date"}
          <Calendar1 className="size-4" />
        </Button>
      </PopoverTrigger>

      {/* Popover Content */}
      <PopoverContent
        className="w-[520px] p-4 shadow-sm rounded-xl"
        align="end"
      >
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickFilters.map((f) => (
            <Button
              key={f.label}
              size="sm"
              variant="ghost"
              className="text-xs"
              onClick={() => applyQuickFilter(f.getRange())}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <Separator className="my-3 bg-outline-med-em" />

        {/* Dual Date Pickers */}
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Start Date"
            value={from}
            onChange={(newValue) => setFrom(newValue)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                InputProps: {
                  className:
                    "text-text-med-em border border-outline-med-em dark:bg-gray-900 dark:text-white rounded-lg",
                },
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={to}
            onChange={(newValue) => setTo(newValue)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                InputProps: {
                  className:
                    "text-text-med-em border border-outline-med-em dark:bg-gray-900 dark:text-white rounded-lg",
                },
              },
            }}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            size="sm"
            className="text-xs"
            onClick={handleOk}
            disabled={!from || !to}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
