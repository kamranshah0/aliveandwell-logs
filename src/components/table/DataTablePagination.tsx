import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { type DataTablePaginationProps } from "./types";

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const total = table.getFilteredRowModel().rows.length;

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-text-low-em">
        Showing <b>{start}</b> to <b>{end}</b> of <b>{total}</b> patients
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={"outline"}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="font-medium"
        >
           <ChevronLeft className="size-5" />
          Previous
        </Button>

        <Button
          variant={"outline"}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="font-medium"
        >
          Next
            <ChevronRight  className="size-5"  />
        </Button>
      </div>
    </div>
  );
}
