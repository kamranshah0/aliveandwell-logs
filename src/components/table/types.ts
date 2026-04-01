import { type Table } from "@tanstack/react-table";

export type FilterOption = { label: string; value: string };

/** Search filter that can restrict which fields to search */
export type SearchFilter<T> = {
  id: string;
  type: "search";
  placeholder?: string;
  /** keys of T to search. If omitted -> search all keys of the row object. */
  fields?: (keyof T)[];
};

export type SelectFilter<T> = {
  id: string;
  type: "select";
  placeholder?: string;
  options: FilterOption[];
};

export type DataTableFilter<T> = SearchFilter<T> | SelectFilter<T>;

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: DataTableFilter<TData>[];
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}
