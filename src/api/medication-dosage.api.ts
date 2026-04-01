import { api } from "@/api/axios";

export const getMedicationDosages = () => {
  return api.get("/medication-dosages");
};

export const getMedicationDosageById = (id: string) => {
  return api.get(`/medication-dosages/${id}`);
};

export const createMedicationDosage = (payload: {
  title: string;
  unit: number;
  value: number;
  unitType: "DAY" | "WEEK" | "MONTH" | "EVERY_X_DAYS";
  status: "ACTIVE" | "INACTIVE";
}) => {
  return api.post("/medication-dosages", payload);
};

export const updateMedicationDosage = (id: string, payload: any) => {
  return api.patch(`/medication-dosages/${id}`, payload);
};

export const deleteMedicationDosage = (id: string) => {
  return api.delete(`/medication-dosages/${id}`);
};
