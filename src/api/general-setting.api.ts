import { api } from "./axios";

export const getGeneralSettings = () => 
  api.get("/general-settings");

export const updateGeneralSettings = (payload: {
  organizationName?: string;
  address?: string;
  phone?: string;
  email?: string;
}) => api.put("/general-settings", payload);
