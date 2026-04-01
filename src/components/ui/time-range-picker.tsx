import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export function TimeRangePicker({
  value,
  onChange,
}: {
  value?: { start: string; end: string };
  onChange: (val: { start: string; end: string }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [temp, setTemp] = React.useState<{ start: string; end: string }>(
    value || { start: "", end: "" }
  );

  const handleSave = () => {
    onChange(temp);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal text-left rounded-xl py-2 px-3 outline-outline-med-em text-text-high-em"
        >
          {value?.start && value?.end ? (
            <span>{`${value.start} – ${value.end}`}</span>
          ) : (
            <span>Select time range</span>
          )}
          <Clock className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4 space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={temp.start}
            onChange={(e) => setTemp({ ...temp, start: e.target.value })}
            className="border rounded-md px-2 py-1 w-full text-sm"
          />
          <span>–</span>
          <input
            type="time"
            value={temp.end}
            onChange={(e) => setTemp({ ...temp, end: e.target.value })}
            className="border rounded-md px-2 py-1 w-full text-sm"
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
}
