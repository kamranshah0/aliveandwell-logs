export interface DosageFormData {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FilterOption = { label: string; value: string };

export type FilterConfig<T> =
  | {
      id: keyof T | "global";
      type: "search";
      placeholder: string;
      fields?: (keyof T)[];
    }
  | {
      id: keyof T;
      type: "select";
      placeholder: string;
      options: FilterOption[];
    };
