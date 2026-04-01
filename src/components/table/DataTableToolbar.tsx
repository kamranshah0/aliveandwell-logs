import { type DataTableToolbarProps } from "./types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select"
import { X, RotateCcw, Calendar as CalendarIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { 
  format, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  isSameDay
} from "date-fns"
import { cn } from "@/lib/utils"
import { type DateRange } from "react-day-picker"
import { useState, useEffect } from "react"

export function DataTableToolbar<TData>({
  table,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const [openDateRangeId, setOpenDateRangeId] = useState<string | null>(null);
  
  // Local state for date pickers to prevent premature re-renders/closures
  const [tempRange, setTempRange] = useState<DateRange | undefined>(undefined);

  // Sync tempRange when internal filter value changes (e.g. from Reset)
  const syncTempRangeFromFilter = (id: string) => {
    const column = table.getColumn(id);
    if (column) {
      setTempRange(column.getFilterValue() as DateRange);
    }
  };

  // Determine which filters are active
  const activeFilters = filters.filter((f) => {
    if (f.type === "search") {
      const g = table.getState().globalFilter as any
      const val = typeof g === "string" ? g : g?.value
      return val !== "" && val !== undefined && val !== null
    } else {
      const col = table.getColumn(String(f.id))
      const v = col?.getFilterValue()
      return v !== "" && v !== undefined && v !== null
    }
  })

  const resetAll = () => {
    table.setGlobalFilter("")
    filters.forEach((f) => {
      if (f.type !== "search") {
        table.getColumn(String(f.id))?.setFilterValue("")
      }
    })
    setTempRange(undefined);
  }

  const removeSingleFilter = (id: string) => {
    const cfg = filters.find((x) => String(x.id) === id)
    if (!cfg) return
    if (cfg.type === "search") table.setGlobalFilter("")
    else table.getColumn(String(id))?.setFilterValue("")
    
    if (cfg.type === "date-range") setTempRange(undefined);
  }

  const datePresets = [
    { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
    { label: "Yesterday", getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
    { label: "This Week", getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
    { label: "Last 7 Days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "This Month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  ];

  return (
    <div className="space-y-3">
      {/* TOP FILTER BAR */}
      <div className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-lg border border-gray-100">
        {filters.map((filter) => {
          if (filter.type === "search") {
            const current = table.getState().globalFilter as any
            const value = typeof current === "string" ? current : current?.value ?? ""

            return (
              <div key={String(filter.id)} className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder={filter.placeholder || "Search..."}
                  className="pl-9 bg-white border-gray-200 h-10 ring-offset-transparent focus-visible:ring-primary/20"
                  value={String(value ?? "")}
                  onChange={(e) => {
                    const val = e.target.value
                    table.setGlobalFilter({
                      value: val,
                      fields: (filter as any).fields?.map(String),
                    })
                  }}
                />
              </div>
            )
          }

          const column = table.getColumn(String(filter.id))
          if (!column) return null

          // SELECT FILTER
          if (filter.type === "select") {
            return (
              <Select
                key={String(filter.id)}
                onValueChange={(value) => column.setFilterValue(value)}
                value={(column.getFilterValue() as string) ?? ""}
              >
                <SelectTrigger className="w-[180px] bg-white border-gray-200 h-10 ring-offset-transparent focus-visible:ring-primary/20 capitalize font-medium text-gray-700 hover:text-primary hover:border-primary/30 transition-all">
                  <SelectValue placeholder={filter.placeholder || "Select"} />
                </SelectTrigger>

                <SelectContent className="border-gray-100 shadow-lg">
                  {filter.options?.map((opt: any) => (
                    <SelectItem key={opt.value} value={opt.value} className="capitalize py-2">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }

          // DATE RANGE FILTER
          if (filter.type === "date-range") {
            const currentFilterValue = (column.getFilterValue() as DateRange) ?? {}
            
            return (
              <Popover 
                key={String(filter.id)} 
                open={openDateRangeId === String(filter.id)}
                onOpenChange={(open) => {
                  setOpenDateRangeId(open ? String(filter.id) : null);
                  if (open) {
                    // Initialize tempRange from current filter value when opening
                    setTempRange(currentFilterValue);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[260px] group justify-start text-left font-medium bg-white border-gray-200 h-10 hover:bg-primary/5 hover:text-primary hover:border-primary/30 text-gray-700 ring-offset-transparent focus-visible:ring-primary/20 transition-all",
                      !currentFilterValue.from && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 group-hover:text-primary" />
                    {currentFilterValue?.from ? (
                      currentFilterValue.to ? (
                        <>
                          <span className="text-gray-900 group-hover:text-primary">{format(currentFilterValue.from, "MMM dd")}</span>
                          <span className="mx-1 text-gray-400">-</span>
                          <span className="text-gray-900 group-hover:text-primary">{format(currentFilterValue.to, "MMM dd, y")}</span>
                        </>
                      ) : (
                        <span className="text-gray-900 group-hover:text-primary">{format(currentFilterValue.from, "MMM dd, y")}</span>
                      )
                    ) : (
                      <span className="group-hover:text-primary">{filter.placeholder || "Pick a date range"}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0 flex shadow-2xl border-gray-100 overflow-hidden rounded-xl" 
                  align="start"
                  onInteractOutside={(e) => {
                    // Prevent closing if interacting inside the calendar components (logic handled by shadcn mostly)
                  }}
                >
                  <div className="flex flex-col border-r bg-gray-50/80 p-3 gap-1.5 min-w-[140px]">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-2">Quick Select</span>
                    {datePresets.map((preset) => {
                      const range = preset.getValue();
                      const isActive = tempRange?.from && tempRange?.to && 
                                      isSameDay(tempRange.from, range.from) && 
                                      isSameDay(tempRange.to, range.to);
                      
                      return (
                        <Button
                          key={preset.label}
                          variant="ghost"
                          className={cn(
                            "justify-start text-xs h-9 px-3 font-medium transition-colors",
                            isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                          )}
                          onClick={() => {
                            setTempRange(range);
                            column.setFilterValue(range); // Apply immediately for presets
                            setOpenDateRangeId(null);
                          }}
                        >
                          {preset.label}
                        </Button>
                      )
                    })}
                  </div>
                  <div className="flex flex-col">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={tempRange?.from}
                      selected={tempRange}
                      onSelect={(range: any) => {
                        // Crucial: Only update LOCAL state here to prevent parent re-renders while picking
                        setTempRange(range);
                      }}
                      numberOfMonths={2}
                      className="p-3"
                    />
                    <div className="p-4 border-t flex justify-between items-center gap-4 bg-gray-50/50">
                       <Button 
                         variant="link" 
                         size="sm" 
                         className="text-xs text-gray-400 hover:text-red-500 p-0 h-auto font-medium"
                         onClick={() => {
                           setTempRange(undefined);
                           column.setFilterValue(undefined);
                           setOpenDateRangeId(null);
                         }}
                       >
                         Clear Filter
                       </Button>
                       <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm" 
                            className="text-xs h-8 border-gray-200"
                            onClick={() => {
                              setTempRange(currentFilterValue); // Revert to current actual filter
                              setOpenDateRangeId(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-xs h-8 px-4"
                            onClick={() => {
                              column.setFilterValue(tempRange);
                              setOpenDateRangeId(null);
                            }}
                          >
                            Apply Range
                          </Button>
                       </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )
          }

          return null
        })}

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            className="flex items-center text-sm gap-2 text-gray-400 hover:text-red-500 transition-colors h-10 px-3 hover:bg-red-50/50"
            onClick={resetAll}
          >
            <RotateCcw className="size-4" /> 
            <span className="font-medium">Reset Filters</span>
          </Button>
        )}
      </div>

      {/* ACTIVE FILTERS TAGS */}
      {activeFilters.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 px-1">
          {activeFilters.map((filter) => {
            let displayLabel = ""

            if (filter.type === "search") {
              const g = table.getState().globalFilter as any
              displayLabel = typeof g === "string" ? g : g?.value ?? ""
            } else if (filter.type === "select") {
              const column = table.getColumn(String(filter.id))
              displayLabel = (column?.getFilterValue() as string) ?? ""
            } else if (filter.type === "date-range") {
              const column = table.getColumn(String(filter.id))
              const val = (column?.getFilterValue() as DateRange) ?? {}
              if (val.from) {
                displayLabel = format(val.from, "MMM dd") + (val.to ? ` - ${format(val.to, "MMM dd, yy")}` : "")
              }
            }

            return (
              <Badge
                key={String(filter.id)}
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary/5 text-primary border border-primary/10 rounded-full font-medium"
              >
                <span className="opacity-70">{filter.placeholder || String(filter.id)}:</span>
                <span className="capitalize">{displayLabel}</span>
                <button 
                  onClick={() => removeSingleFilter(String(filter.id))}
                  className="ml-1 hover:bg-primary/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
