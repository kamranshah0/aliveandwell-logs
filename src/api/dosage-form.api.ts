import { api } from "./axios";

export const fetchDosageForms = () => api.get("/dosage-forms");

export const createDosageForm = (data: { name: string; description?: string }) =>
  api.post("/dosage-forms", data);

export const getDosageFormById = (id: string) => api.get(`/dosage-forms/${id}`);

export const updateDosageForm = (
  id: string,
  data: { name: string; description?: string }
) => api.patch(`/dosage-forms/${id}`, data);

export const deleteDosageForm = (id: string) => api.delete(`/dosage-forms/${id}`);
