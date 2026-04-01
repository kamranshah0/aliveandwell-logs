

export type DataTypes = {
  id: string;
  medicationName: string;
  drugCategory: string;
  formType: string;
  pharmacy: string;
  status: "active" | "inactive";
};


export type FilterOption = { label: string; value: string };

export type FilterConfig<T> =
  | {
      id: keyof T;
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
