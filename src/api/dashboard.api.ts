import { api } from "@/api/axios";

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};
export const getDashboardRefillActivity = () => {
  return api.get("/dashboard/refill-activity/monthly");
};

 