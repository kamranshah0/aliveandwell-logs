import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTypes } from "./types";

export const TableColumns = (
  onDelete: (id: string) => void
): ColumnDef<DataTypes>[] => [
  {
    accessorKey: "medicationName",
    header: "Medication Name",
    cell: ({ row }) => (
      <p className="font-semibold">{row.getValue("medicationName")}</p>
    ),
  },
  {
    accessorKey: "drugCategory",
    header: "Drug Category",
  },
  {
    accessorKey: "formType",
    header: "Form",
  },
  {
    accessorKey: "pharmacy",
    header: "Pharmacy",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "ACTIVE" ? "success" : "outline"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const medicine = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer flex items-center justify-center p-2 rounded hover:bg-surface-2 transition-colors">
            <MoreVertical className="text-text-med-em size-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 border-outline-low-em"
          >
            <Link to={`/medicines/edit/${medicine.id}`}>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Edit className="size-4 text-text-high-em" />
                Edit Medicine
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-error-em"
              onClick={() => onDelete(medicine.id)}
            >
              <Trash2 className="size-4" />
              Delete Medicine
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
