import { type DataTableToolbarProps } from "./types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select"
import { X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DataTableToolbar<TData>({
  table,
  filters = [],
}: DataTableToolbarProps<TData>) {
  // Determine which filters are active (consider structured globalFilter)
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
    // clear global filter
    table.setGlobalFilter("")
    // clear column filters
    filters.forEach((f) => {
      if (f.type !== "search") {
        table.getColumn(String(f.id))?.setFilterValue("")
      }
    })
  }

  const removeSingleFilter = (id: string) => {
    const cfg = filters.find((x) => String(x.id) === id)
    if (!cfg) return
    if (cfg.type === "search") table.setGlobalFilter("")
    else table.getColumn(String(id))?.setFilterValue("")
  }

  return (
    <div className="space-y-3">
      {/* TOP FILTER BAR */}
      <div className="flex items-center gap-3 p-2">
        {filters.map((filter) => {
          // handle search without trying to read a column first
          if (filter.type === "search") {
            const current = table.getState().globalFilter as any
            const value = typeof current === "string" ? current : current?.value ?? ""

            return (
              <Input
                key={String(filter.id)}
                placeholder={filter.placeholder || "Search..."}
                className="max-w-xs bg-gray-low-em"
                value={String(value ?? "")}
                onChange={(e) => {
                  const val = e.target.value
                  // set structured global filter: { value, fields? }
                  table.setGlobalFilter({
                    value: val,
                    fields: (filter as any).fields?.map(String),
                  })
                }}
              />
            )
          }

          // for non-search filters we need the corresponding column
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
                <SelectTrigger className="w-[160px] bg-gray-low-em">
                  <SelectValue placeholder={filter.placeholder || "Select"} />
                </SelectTrigger>

                <SelectContent>
                  {filter.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }

          return null
        })}

        {/* RESET ALL BUTTON — only if filters active */}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            className="flex items-center text-sm gap-1 text-text-med-em"
            onClick={resetAll}
          >
            <RotateCcw className="size-4 " /> Reset
          </Button>
        )}
      </div>

      {/* ACTIVE FILTERS TAGS */}
      {activeFilters.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 px-2">
          {activeFilters.map((filter) => {
            // for search read globalFilter.value, for selects read column filter value
            let displayValue: string | undefined = undefined

            if (filter.type === "search") {
              const g = table.getState().globalFilter as any
              displayValue = typeof g === "string" ? g : g?.value ?? ""
            } else {
              const column = table.getColumn(String(filter.id))
              displayValue = (column?.getFilterValue() as string) ?? ""
            }

            return (
              <Badge
                key={String(filter.id)}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1 text-sm"
              >
                {filter.placeholder || String(filter.id)}: {String(displayValue)}
                <button onClick={() => removeSingleFilter(String(filter.id))}>
                  <X className="h-4 w-4 cursor-pointer" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
