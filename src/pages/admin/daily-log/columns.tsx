import type { ColumnDef } from "@tanstack/react-table";
import type { DailyLogType } from "./types";
import { Check, X } from "lucide-react";

const renderCheck = (val: boolean) => val ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-300" />;

export const generateColumns = (dynamicFields: any[]): ColumnDef<DailyLogType>[] => {
  const baseColumns: ColumnDef<DailyLogType>[] = [
    {
      accessorKey: "date",
      header: "Date",
      filterFn: 'dateRange' as any,
      cell: ({ row }) => <span className="whitespace-nowrap font-medium text-text-high-em">{row.original.date}</span>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em font-bold">{row.original.location}</span>,
    },
    {
      accessorKey: "representative",
      header: "Rep",
      cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em font-bold">{row.original.representative}</span>,
    },
  ];

  const baseKeys = baseColumns.map(c => (c as any).accessorKey);

  const dynamicCols: ColumnDef<DailyLogType>[] = dynamicFields
    .filter(f => !baseKeys.includes(f.name))
    .map((field) => ({
      accessorKey: field.name,
      header: field.label,
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

  return [...baseColumns, ...dynamicCols];
};

// Legacy export for compatibility if needed, but we should use generateColumns
export const TableColumns = generateColumns([]);
