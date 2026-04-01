import type { FilterConfig, DataTypes } from "./types";

export const DataFilters: FilterConfig<DataTypes>[] = [
  {
    id: "name", // UI id for the search input (doesn't mean only 'name' will be searched)
    type: "search",
    placeholder: "Search…",
    // specify which keys on DataTypes should be searched
    fields: ["name", "pharmacy", "id"], // e.g. search name, rxId and id
  },

  {
    id: "pharmacy",
    type: "select",
    placeholder: "Pharmacy",
    options: [
      { label: "Pharmco", value: "Pharmco" },
      { label: "Walgreens", value: "Walgreens" },
    ],
  },
  {
    id: "status",
    type: "select",
    placeholder: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];
