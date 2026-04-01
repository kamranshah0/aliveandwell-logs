export type DataTypes = {
  id: string
  name: string
  dob: string
  phone: string
  pharmacy: string
  programs: string
  medications: number
  status: string
  email: string
  programsLabel: string
}

export type FilterOption = { label: string; value: string };

export type FilterConfig<T> =
  | {
      id: keyof T;
      type: "search";
      placeholder: string;
      // OPTIONAL: list of keys of T to search when this search input is used
      fields?: (keyof T)[];
    }
  | {
      id: keyof T;
      type: "select";
      placeholder: string;
      options: FilterOption[];
    };
