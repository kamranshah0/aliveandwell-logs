import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Eye,
  HandHeart,
  MoreVertical,
  Phone,
  Trash2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { DataTypes } from "./types";

import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/dateUtils";

export const TableColumns: ColumnDef<DataTypes>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p className="font-semibold">{row.getValue("name")}</p>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <p>{row.getValue("email")}</p>,
  },
  {
    accessorKey: "dob",
    header: "DOB",
    cell: ({ row }) => <p>{formatDate(row.getValue("dob"))}</p>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-text-med-em">
        <Phone className="text-text-low-em size-5" /> {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "pharmacy",
    header: "Assigned Pharmacy",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("pharmacy")}</Badge>
    ),
  },
  {
    accessorKey: "programsLabel",
    header: "Programs",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("programsLabel")}</Badge>
    ),
  },
  {
    accessorKey: "medications",
    header: "Medications",
    cell: ({ row }) => (
      <Badge variant={"success"}>{row.getValue("medications")} active</Badge>
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
        variant={row.getValue("status") === "active" ? "primary" : "outline"}
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table, ...rest }: any) => {
      const patient = row.original;
      const { onDelete } = rest;
      const navigate = useNavigate();

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className=" text-text-med-em hover:text-text-high-em cursor-pointer flex items-center justify-center p-2 rounded  hover:bg-surface-2">
              <MoreVertical className=" size-5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/patient/view/${patient.id}`)}
              >
                View Details
                <Eye className="size-4 text-text-high-em" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/patient/edit/${patient.id}`)}
              >
                Edit Patient
                <Edit className="size-4 text-text-high-em" />
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={patient.programs?.length === 0}
                onClick={() => {
                  table.options.meta?.openDisenroll(patient);
                }}
              >
                Disenroll Program
                <HandHeart className="size-5 text-text-danger-em" />
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onDelete?.(patient.id)}>
                Delete
                <Trash2 className="size-4 text-text-danger-em" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <DisenrollProgramModal
              open={openDisenroll}
              
              onClose={() => setOpenDisenrol(false)}
              programs={patient.programs}

              
            /> */}
        </>
      );
    },
  },
];
