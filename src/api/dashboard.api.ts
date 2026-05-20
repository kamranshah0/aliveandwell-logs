import { api } from "@/api/axios";

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};
export const getDashboardRefillActivity = () => {
  return api.get("/dashboard/refill-activity/monthly");
};

export const getDashboardConfig = (branchId?: string | null) => {
  return api.get("/dashboard/config", {
    params: branchId ? { branchId } : undefined,
  });
};

export const updateDashboardConfig = (payload: any, branchId?: string | null) => {
  return api.patch("/dashboard/config", payload, {
    params: branchId ? { branchId } : undefined,
  });
};
