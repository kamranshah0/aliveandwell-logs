import type { FilterConfig, DataTypes } from "./types";
export const DataFilters: FilterConfig<DataTypes>[] = [
  {
    id: "name",
    type: "search",
    placeholder: "Search…",
    fields: ["name", "pharmacy", "id"],
  },
  {
    id: "pharmacy",
    type: "select",
    placeholder: "Pharmacy",
    options: [
      { label: "Alive and Well", value: "Alive and Well" },
      { label: "Pharmco", value: "Pharmco" },
    ],
  },
];

export const refillData = [
  {
    id: "1",
    name: "Emily Chen",
    medication: "Atorvastatin 20mg",
    pharmacy: "Walmart",
    overdue: "2 days overdue",
  },
  {
    id: "2",
    name: "Robert Brown",
    medication: "Synthroid 75mcg",
    pharmacy: "Pharmco",
    overdue: "5 days overdue",
  },
];
