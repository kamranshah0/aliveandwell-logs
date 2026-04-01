export type MedicationDosage = {
  id: string;
  title: string;
  unit: number;
  value: number;
  unitType: "DAY" | "WEEK" | "MONTH" | "EVERY_X_DAYS";
  dailyDose: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
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
