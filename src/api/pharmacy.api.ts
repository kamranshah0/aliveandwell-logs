import { api } from "./axios";

export const getPharmacies = () =>
  api.get("/pharmacy");


export const getPharmacyById = (id: string) => {
  return api.get(`/pharmacy/${id}`);
};