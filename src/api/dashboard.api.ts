import { api } from "@/api/axios";

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};
export const getDashboardRefillActivity = () => {
  return api.get("/dashboard/refill-activity/monthly");
};

export const getDashboardConfig = () => {
  return api.get("/dashboard/config");
};

export const updateDashboardConfig = (payload: any) => {
  return api.patch("/dashboard/config", payload);
};