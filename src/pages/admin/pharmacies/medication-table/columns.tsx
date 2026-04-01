import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
// import { Edit, Eye, MoreVertical, Phone, Trash2 } from "lucide-react";
import type { DataTypes } from "./types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/dateUtils";

export const TableColumns: ColumnDef<DataTypes>[] = [
  {
    accessorKey: "patient",
    header: "Patient ",
    cell: ({ row }) => (
      <p className="font-semibold">{row.getValue("patient")}</p>
    ),
  },

  {
    accessorKey: "medications",
    header: "Medications",
    cell: ({ row }) => <p>{row.getValue("medications")}</p>,
  },
  {
    accessorKey: "refillDate",
    header: "Refill Date",
    cell: ({ row }) => (
      <p className="text-text-high-em min-w-[100px]">
        {formatDate(row.getValue("refillDate"))}
      </p>
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
    id: "actions",
    header: "Actions",
    cell: ({ row  }: any) => {
      const data = row.original; 
      return (
        // <Link to={`/medications/view-medication`}>
        <Link to={`/medications/view-medication/${data.id}`}>
       <Button variant={'ghostpm'} onClick={()=>console.log('view medications',data.id)}> View Medication</Button>
        </Link>
      );
    },
  },
];
