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
    accessorKey: "representative",
    header: "Rep",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.representative}</span>,
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-bold text-text-high-em">
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
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
    accessorKey: "primaryCarePatient",
    header: "Prim.",
    cell: ({ row }) => renderCheck(row.original.primaryCarePatient),
  },
  {
    accessorKey: "results",
    header: "Res.",
    cell: ({ row }) => renderCheck(row.original.results),
  },
  {
    accessorKey: "proofOfAddress",
    header: "Addr.",
    cell: ({ row }) => renderCheck(row.original.proofOfAddress),
  },
  {
    accessorKey: "insuranceCheck",
    header: "Ins.",
    cell: ({ row }) => renderCheck(row.original.insuranceCheck),
  },
  {
    accessorKey: "oneTimeTesting",
    header: "OTT",
    cell: ({ row }) => renderCheck(row.original.oneTimeTesting),
  },
  {
    accessorKey: "disenrolled",
    header: "Disenr.",
    cell: ({ row }) => renderCheck(row.original.disenrolled),
  },
  {
    accessorKey: "hivTestNoEnroll",
    header: "HIV",
    cell: ({ row }) => renderCheck(row.original.hivTestNoEnroll),
  },
  {
    accessorKey: "disregardLeft",
    header: "Left",
    cell: ({ row }) => renderCheck(row.original.disregardLeft),
  },
  {
    accessorKey: "cashVisit",
    header: "Cash Visit",
    cell: ({ row }) => <span className="whitespace-nowrap text-text-med-em">{row.original.cashVisit}</span>,
  },
  {
    accessorKey: "copayAmount",
    header: "Copay",
    cell: ({ row }) => <span className="text-text-med-em font-semibold">${row.original.copayAmount || '0.00'}</span>,
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
];
