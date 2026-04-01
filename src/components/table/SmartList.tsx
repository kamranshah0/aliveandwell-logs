import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";

interface SmartListProps<TData> {
  /** Data array */
  data: TData[];

  /** Optional filters (same structure as DataTable) */
  filters?: any[];

  /** If user still wants table support (optional) */
  columns?: ColumnDef<TData, any>[];

  /** 🚀 MAIN FEATURE — custom card renderer */
  renderRow: (row: TData) => React.ReactNode;

  /** Optional delete handler */
  onDelete?: (id: string | number) => void;
}

export function SmartList<TData>({
  data,
  columns = [],
  filters = [],
  renderRow,
  onDelete,
}: SmartListProps<TData>) {
  const table = useReactTable({
    data,
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

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnFilters: true,

    // SAME global filter system as your DataTable
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
    <div className="space-y-4">

      {filters.length > 0 && (
        <DataTableToolbar table={table} filters={filters} />
      )}

      {/* 🚀 CARD VIEW */}
      <div className="flex flex-col gap-4">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id}>{renderRow(row.original)}</div>
        ))}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
