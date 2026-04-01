// src/features/medications/filters.ts
import type { FilterConfig, DataTypes } from "./types";

export const DataFilters: FilterConfig<DataTypes>[] = [
  {
    id: "medicationName",
    type: "search",
    placeholder: "Search Medicine...",
    fields: ["medicationName", "drugCategory"],
  },
  {
    id: "drugCategory",
    type: "select",
    placeholder: "Drug Category",
    options: [
      { label: "Pain Relief", value: "Pain Relief" },
      { label: "Diabetes", value: "Diabetes" },
      { label: "Respiratory", value: "Respiratory" },
      { label: "Antibiotic", value: "Antibiotic" },
    ],
  },
  {
    id: "status",
    type: "select",
    placeholder: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Discontinued", value: "discontinued" },
    ],
  },
];
