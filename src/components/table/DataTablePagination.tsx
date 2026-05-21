import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { type DataTablePaginationProps } from "./types";

export function DataTablePagination<TData>({
  table,
  manualPagination,
}: DataTablePaginationProps<TData>) {
  const pageIndex = manualPagination?.pageIndex ?? table.getState().pagination.pageIndex;
  const pageSize = manualPagination?.pageSize ?? table.getState().pagination.pageSize;
  const total = manualPagination?.total ?? table.getFilteredRowModel().rows.length;

  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);
  const canPreviousPage = manualPagination
    ? pageIndex > 0
    : table.getCanPreviousPage();
  const canNextPage = manualPagination
    ? end < total
    : table.getCanNextPage();

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-text-low-em">
        Showing <b>{start}</b> to <b>{end}</b> of <b>{total}</b> records
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={"outline"}
          onClick={() =>
            manualPagination
              ? manualPagination.onPageChange(pageIndex - 1)
              : table.previousPage()
          }
          disabled={!canPreviousPage}
          className="font-medium"
        >
           <ChevronLeft className="size-5" />
          Previous
        </Button>

        <Button
          variant={"outline"}
          onClick={() =>
            manualPagination
              ? manualPagination.onPageChange(pageIndex + 1)
              : table.nextPage()
          }
          disabled={!canNextPage}
          className="font-medium"
        >
          Next
            <ChevronRight  className="size-5"  />
        </Button>
      </div>
    </div>
  );
}
