import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Trash2, Eye } from "lucide-react";

import type { DataTypes } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TableColumns: ColumnDef<DataTypes>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "medication",
    header: "Medication",
  },
  {
    accessorKey: "pharmacy",
    header: "Pharmacy",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("pharmacy")}</Badge>
    ),
  },
  {
    accessorKey: "overdue",
    header: "Overdue",
    cell: ({ row }) => (
      <Badge variant="destructive">{row.getValue("overdue")}</Badge>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row, ...rest }: any) => {
      const item = row.original;
      const { onDelete } = rest;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              View <Eye className="ml-2 h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onDelete?.(item.id)}>
              Delete <Trash2 className="ml-2 h-4 w-4 text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
