// src/features/medications/filters.ts
import type { FilterConfig, DataTypes } from "./types";

export const DataFilters: FilterConfig<DataTypes>[] = [
  {
    id: "name", // UI id for the search input (doesn't mean only 'name' will be searched)
    type: "search",
    placeholder: "Search…",
    // specify which keys on DataTypes should be searched
    fields: ["name", "rxId", "id"] // e.g. search name, rxId and id
  },
  {
    id: "status",
    type: "select",
    placeholder: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Due Soon", value: "due soon" },
      { label: "Overdue", value: "overdue" },
    ],
  },
];
