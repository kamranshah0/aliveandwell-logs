import { api } from "./axios";

export const fetchMedicines = () => api.get("/medicines");

export const createMedicine = (payload: any) => {
  return api.post("/medicines", payload);
};

export const getMedicineById = (id: string) => {
  return api.get(`/medicines/${id}`);
};

export const updateMedicine = (id: string, payload: any) => {
  return api.patch(`/medicines/${id}`, payload);
};

export const deleteMedicine = (id: string) => {
  return api.delete(`/medicines/${id}`);
};
