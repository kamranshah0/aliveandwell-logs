import { api } from "./axios";

export const fetchDrugCategories = () => api.get("/drug-categories");

export const createDrugCategory = (payload: any) => {
  return api.post("/drug-categories", payload);
};

export const getDrugCategoryById = (id: string) => {
  return api.get(`/drug-categories/${id}`);
};

export const updateDrugCategory = (id: string, payload: any) => {
  return api.patch(`/drug-categories/${id}`, payload);
};

export const deleteDrugCategory = (id: string) => {
  return api.delete(`/drug-categories/${id}`);
};
