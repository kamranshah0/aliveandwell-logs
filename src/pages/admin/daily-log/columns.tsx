import type { ColumnDef } from "@tanstack/react-table";
import type { DailyLogType } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const renderCheck = (val: boolean) => val ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-300" />;

const SortableHeader = ({ column, title }: { column: any, title: string }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-4 h-8 text-xs font-semibold hover:bg-transparent"
    >
      {title}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );
};

export const generateColumns = (dynamicFields: any[]): ColumnDef<DailyLogType>[] => {
  const baseColumns: ColumnDef<DailyLogType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} title="Log Date" />,
      filterFn: 'dateRange' as any,
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId) as string);
        const dateB = new Date(rowB.getValue(columnId) as string);
        return dateA.getTime() - dateB.getTime();
      },
      cell: ({ row }) => <span className="whitespace-nowrap font-medium text-text-high-em">{row.original.date}</span>,
    },
    {
      accessorKey: "location",
      header: ({ column }) => <SortableHeader column={column} title="Location" />,
      cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em font-bold">{row.original.location}</span>,
    },
    {
      accessorKey: "representative",
      header: ({ column }) => <SortableHeader column={column} title="Rep" />,
      cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em font-bold">{row.original.representative}</span>,
    },
  ];

  const baseKeys = baseColumns.map(c => (c as any).accessorKey);

  const dynamicCols: ColumnDef<DailyLogType>[] = dynamicFields
    .filter(f => !baseKeys.includes(f.name))
    .map((field) => ({
      accessorKey: field.name,
      header: ({ column }) => <SortableHeader column={column} title={field.label} />,
      cell: ({ row }) => {
        // Data might be in root or in additionalData
        const val = (row.original as any)[field.name] ?? row.original.additionalData?.[field.name];
        
        if (field.type === "checkbox") {
          return renderCheck(!!val);
        }
        
        if (field.type === "number" && field.name.toLowerCase().includes("amount")) {
          return <span className="font-semibold">${val || "0.00"}</span>;
        }

        return <span className="whitespace-nowrap text-text-med-em">{val || "-"}</span>;
      },
    }));

  const createdAtCol: ColumnDef<DailyLogType> = {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-text-low-em text-xs italic">
        {row.original.createdAt ? format(new Date(row.original.createdAt), "MM/dd/yyyy HH:mm") : "-"}
      </span>
    ),
  };

  return [...baseColumns, ...dynamicCols, createdAtCol];
};

// Legacy export for compatibility if needed, but we should use generateColumns
export const TableColumns = generateColumns([]);
