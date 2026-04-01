import type { FilterConfig, DosageFormData } from "./types";

export const DataFilters: FilterConfig<DosageFormData>[] = [
  {
    id: "name",
    type: "search",
    placeholder: "Search forms...",
    fields: ["name", "description"],
  },
];
