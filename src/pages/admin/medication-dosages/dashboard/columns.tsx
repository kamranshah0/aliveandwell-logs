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
import type { MedicationDosage } from "./types";
import { formatDate } from "@/utils/dateUtils";

export const TableColumns = (
  onDelete: (id: string) => void
): ColumnDef<MedicationDosage>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <p className="font-semibold">{row.getValue("title")}</p>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => <p>{row.getValue("unit")}</p>,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => <p>{row.getValue("value")}</p>,
  },
  {
    accessorKey: "unitType",
    header: "Frequency",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("unitType")}</Badge>
    ),
  },
  {
    accessorKey: "dailyDose",
    header: "Daily Dose",
    cell: ({ row }) => (
      <p className="font-medium text-primary-em">{row.getValue("dailyDose")}</p>
    ),
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
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <p className="text-xs text-text-med-em">
        {formatDate(row.getValue("createdAt"))}
      </p>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <p className="text-xs text-text-med-em">
        {formatDate(row.getValue("updatedAt"))}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const dosage = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer flex items-center justify-center p-2 rounded hover:bg-surface-2 transition-colors">
            <MoreVertical className="text-text-med-em size-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 border-outline-low-em"
          >
            <Link to={`/medication-dosages/edit/${dosage.id}`}>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Edit className="size-4 text-text-high-em" />
                Edit Dosage
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-error-em"
              onClick={() => onDelete(dosage.id)}
            >
              <Trash2 className="size-4" />
              Delete Dosage
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
