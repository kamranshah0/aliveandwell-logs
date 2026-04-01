import { api } from "@/api/axios";

export const createMedication = (payload: {
  patientId: string;
  medicineId: string;
  dosageId: string;
  prescriberId: string;
  quantity: number;
  refills: number;
  rxDurationDays: number;
  status: "ACTIVE" | "INACTIVE";
  notes?: string;
}) => {
  return api.post("/medications", payload);
};

export const getMedications = () => {
  return api.get("/medications");
};
export const getMedicationsStats = () => {
  return api.get("/medications/stats");
};

export const getMedicationById = (id: string) => {
  return api.get(`/medications/${id}`);
};

export const updateMedication = (id: string, payload: any) => {
  return api.patch(`/medications/${id}`, payload);
};
export const deleteMedication = (id: string) => {
  return api.delete(`/medications/${id}`);
};
