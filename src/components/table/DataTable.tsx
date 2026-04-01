import {
  flexRender,
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import { Skeleton } from "@/components/skeletons/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
  parse, 
  isWithinInterval, 
  startOfDay, 
  endOfDay,
  isValid 
} from "date-fns";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  filters?: any[];
  onDelete?: (id: string | number) => void;
  onBulkDelete?: (ids: string[]) => void;
  isBulkDeleting?: boolean;
  isLoading?: boolean;
  meta?: any;
}

export function DataTable<TData>({
  columns,
  data,
  filters = [],
  onDelete,
  onBulkDelete,
  isBulkDeleting = false,
  meta,
  isLoading = false,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    meta,
    columns: columns.map((col) => {
      if (col.id === "actions") {
        const originalCell = col.cell;
        return {
          ...col,
          cell: (info: any) => (originalCell as any)({ ...info, onDelete }),
        } as ColumnDef<TData, any>;
      }
      return col;
    }),

    filterFns: {
      dateRange: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string;
        if (!filterValue || !filterValue.from) return true;
        
        // Parse the row date (format MM/dd/yyyy)
        const rowDate = parse(value, 'MM/dd/yyyy', new Date());
        if (!isValid(rowDate)) return true;

        const from = startOfDay(filterValue.from);
        const to = filterValue.to ? endOfDay(filterValue.to) : endOfDay(filterValue.from);

        return isWithinInterval(rowDate, { start: from, end: to });
      },
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnFilters: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },

    globalFilterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;

      const payload =
        typeof filterValue === "string"
          ? { value: filterValue, fields: undefined as string[] | undefined }
          : (filterValue as { value?: string; fields?: string[] });

      const search = String(payload.value ?? "")
        .trim()
        .toLowerCase();
      if (!search) return true;

      const keysToSearch: string[] = payload.fields
        ? payload.fields.map(String)
        : Object.keys(row.original as object);

      return keysToSearch.some((k) => {
        const v = (row.original as any)[k];
        return String(v ?? "")
          .toLowerCase()
          .includes(search);
      });
    },
  });

  return (
    <div className="space-y-4 ">
      {filters.length > 0 && (
        <DataTableToolbar table={table} filters={filters} />
      )}

      {onBulkDelete && Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg mb-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Trash2 className="size-4 text-text-danger-em" />
            <span className="text-sm font-semibold text-text-danger-em">
              {Object.keys(rowSelection).length} record(s) selected
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
            disabled={isBulkDeleting}
            onClick={() => {
              const selectedIds = table
                .getSelectedRowModel()
                .rows.map((row) => (row.original as any).id);
              onBulkDelete(selectedIds);
              setRowSelection({});
            }}
          >
            {isBulkDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Permanently
              </>
            )}
          </Button>
        </div>
      )}

      <div className="rounded-lg border bg-white overflow-hidden drop-shadow-xs">
        <div className="overflow-x-auto">
          <table className="hidden md:table w-full">
            <thead className="border-b-1 border-outline-high-em">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-4 text-left text-sm text-text-low-em font-semibold whitespace-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-t-[0.5px] border-outline-high-em"
                  >
                    {columns.map((_, colIdx) => (
                      <td key={colIdx} className="p-4">
                        <Skeleton className="h-4 w-full max-w-[160px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr className="border-t-[0.5px] border-outline-high-em hover:bg-primary/5">
                  <td
                    className="p-4 text-sm text-text-high-em text-center"
                    colSpan={columns.length}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t-[0.5px] border-outline-high-em hover:bg-primary/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 text-sm text-text-high-em whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y-2">
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} className="p-4">
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="flex justify-between py-1">
                  <span className="text-xs text-gray-500 font-medium">
                    {cell.column.columnDef.header as string}
                  </span>

                  <div className="text-sm font-medium max-w-[60%] text-right">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
