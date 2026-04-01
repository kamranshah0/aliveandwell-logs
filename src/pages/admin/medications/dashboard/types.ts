export type DataTypes = {
  id: string;
  name: string;
  rxId: string;
  medications: string;
  quantity: number;
  dosage: string;
  refills: number;
  status: string;
  nextRefill: string;
  category?: string;
};

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
