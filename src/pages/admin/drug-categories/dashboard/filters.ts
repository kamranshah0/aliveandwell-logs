import type { FilterConfig, DrugCategoryData } from "./types";

export const DataFilters: FilterConfig<DrugCategoryData>[] = [
  {
    id: "name",
    type: "search",
    placeholder: "Search categories...",
    fields: ["name", "description"],
  },
];
