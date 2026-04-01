import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import type { DataTypes } from "./types";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/dateUtils";

export const TableColumns: ColumnDef<DataTypes>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p className="font-semibold">{row.getValue("name")}</p>,
  },
  {
    accessorKey: "rxId",
    header: "RX ID",
    cell: ({ row }) => (
      <p className="text-text-high-em font-medium min-w-[80px] ">
        {row.getValue("rxId")}
      </p>
    ),
  },
  {
    accessorKey: "medications",
    header: "Medications",
    cell: ({ row }) => <p>{row.getValue("medications")}</p>,
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, id, value) => {
      if (!value) return true;
      return row.getValue(id) === value;
    },
    cell: ({ row }) => (
      <p className="text-text-med-em text-xs">
        {row.getValue("category") || "-"}
      </p>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "dosage",
    header: "Dosage",
    cell: ({ row }) => (
      <p className="text-text-med-em text-xs">{row.getValue("dosage")}</p>
    ),
  },
  {
    accessorKey: "refills",
    header: "Refills",
    cell: ({ row }) => (
      <Badge variant={row.getValue("refills") == "0" ? "danger" : "success"}>
        {row.getValue("refills")} left
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => {
      if (!value) return true;
      return row.getValue(id) === value;
    },
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "active"
            ? "primary"
            : row.getValue("status") === "inactive"
              ? "outline"
              : row.getValue("status") === "due soon"
                ? "warning"
                : "danger"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "nextRefill",
    header: "Next Refill",
    cell: ({ row }) => (
      <p className="text-text-high-em min-w-[100px]">
        {formatDate(row.getValue("nextRefill"))}
      </p>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row, onDelete }: any) => {
      const med = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer flex items-center justify-center p-2 rounded hover:bg-surface-2 transition-colors">
            <MoreVertical className="text-text-med-em size-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-45 border-outline-low-em"
          >
            <Link to={`/medications/view-medication/${med.id}`}>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Eye className="size-4 text-text-high-em" />
                View Details
              </DropdownMenuItem>
            </Link>
            <Link to={`/medication/edit/${med.id}`}>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Edit className="size-4 text-text-high-em" />
                Edit Medication
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-error-em"
              onClick={() => onDelete?.(med.id)}
            >
              <Trash2 className="size-4" />
              Delete Medication
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
