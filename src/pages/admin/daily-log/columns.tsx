import type { ColumnDef } from "@tanstack/react-table";
import type { DailyLogType } from "./types";
import { Check, X } from "lucide-react";
// import React from "react"; (unused)

const renderCheck = (val: boolean) => val ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-300" />;

export const TableColumns: ColumnDef<DailyLogType>[] = [
  {
    accessorKey: "date",
    header: "Date",
    filterFn: 'dateRange' as any,
    cell: ({ row }) => <span className="whitespace-nowrap font-medium text-text-high-em">{row.original.date}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.location}</span>,
  },
  {
    accessorKey: "representative",
    header: "Rep",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em font-bold">{row.original.representative}</span>,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => <span className="whitespace-nowrap font-bold text-text-high-em">{row.original.lastName}</span>,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => <span className="whitespace-nowrap font-bold text-text-high-em">{row.original.firstName}</span>,
  },
  {
    accessorKey: "dob",
    header: "DOB",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.dob}</span>,
  },
  {
    accessorKey: "doctorNpName",
    header: "Doctor/NP",
    cell: ({ row }) => <span className="max-w-[120px] truncate block text-text-med-em">{row.original.doctorNpName}</span>,
  },
  {
    accessorKey: "lab",
    header: "Lab",
    cell: ({ row }) => <span className="capitalize text-text-med-em">{row.original.lab}</span>,
  },
  {
    accessorKey: "labRep",
    header: "Lab Rep",
    cell: ({ row }) => <span className="capitalize text-text-med-em">{row.original.labRep}</span>,
  },
  {
    accessorKey: "newPatient",
    header: "New",
    cell: ({ row }) => renderCheck(row.original.newPatient),
  },
  {
    accessorKey: "enrolled",
    header: "Enrolled",
    cell: ({ row }) => renderCheck(row.original.enrolled),
  },
  {
    accessorKey: "proofOfAddress",
    header: "Addr.",
    cell: ({ row }) => <span className="capitalize text-text-med-em">{row.original.proofOfAddress}</span>,
  },
  {
    accessorKey: "eligibilityCheck",
    header: "Elig.",
    cell: ({ row }) => <span className="capitalize text-text-med-em">{row.original.eligibilityCheck}</span>,
  },
  {
    accessorKey: "insuranceCheck",
    header: "Ins.",
    cell: ({ row }) => <span className="capitalize text-text-med-em">{row.original.insuranceCheck}</span>,
  },
  {
    accessorKey: "visitType",
    header: "Visit Type",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.visitType}</span>,
  },
  {
    accessorKey: "visitServices",
    header: "Services",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.visitServices}</span>,
  },
  {
    accessorKey: "copayAmount",
    header: "Copay",
    cell: ({ row }) => <span className="text-text-med-em font-semibold">${row.original.copayAmount || '0.00'}</span>,
  },
  {
    accessorKey: "copaySource",
    header: "Source",
    cell: ({ row }) => <span className="text-text-med-em">{row.original.copaySource}</span>,
  },
  {
    accessorKey: "copayReceiptNumber",
    header: "Receipt",
    cell: ({ row }) => <span className="text-text-med-em">{row.original.copayReceiptNumber}</span>,
  },
  {
    accessorKey: "marketingSource",
    header: "Marketing",
    cell: ({ row }) => <span className="text-text-med-em">{row.original.marketingSource}</span>,
  },
  {
    accessorKey: "nextApptDate",
    header: "Next Appt",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.nextApptDate}</span>,
  },
  {
    accessorKey: "adviseCancellationFee",
    header: "Can. Fee",
    cell: ({ row }) => <span className="capitalize text-text-med-em">{row.original.adviseCancellationFee}</span>,
  },
  {
    accessorKey: "adviseProgram",
    header: "Prog.",
    cell: ({ row }) => <span className="capitalize text-text-med-em">{row.original.adviseProgram}</span>,
  },
  {
    accessorKey: "dhFormRep",
    header: "DH Rep",
    cell: ({ row }) => <span className="text-text-med-em">{row.original.dhFormRep}</span>,
  },
  {
    accessorKey: "dhFormNumber",
    header: "DH Form",
    cell: ({ row }) => <span className="text-text-med-em">{row.original.dhFormNumber}</span>,
  },
  {
    accessorKey: "drOrdered",
    header: "Dr. Ordered",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.drOrdered}</span>,
  },
  {
    accessorKey: "orderType",
    header: "Order Type",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.orderType}</span>,
  },
  {
    accessorKey: "pharmacy",
    header: "Pharmacy",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.pharmacy}</span>,
  },
];
