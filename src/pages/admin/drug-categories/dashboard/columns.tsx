import { type ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DrugCategoryData } from "./types";
import { formatDate } from "@/utils/dateUtils";

export const TableColumns: ColumnDef<DrugCategoryData>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => (
      <p className="font-semibold">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, onDelete }: any) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer flex items-center justify-center p-2 rounded hover:bg-surface-2 transition-colors">
            <MoreVertical className="text-text-med-em size-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 border-outline-low-em"
          >
            <Link to={`/drug-categories/edit/${category.id}`}>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Edit className="size-4 text-text-high-em" />
                Edit Category
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem 
              className="cursor-pointer gap-2 text-text-danger-em focus:text-text-danger-em"
              onClick={() => onDelete(category.id)}
            >
              <Trash2 className="size-4" />
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
