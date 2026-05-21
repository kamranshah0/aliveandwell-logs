import { api } from "@/api/axios";

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};
export const getDashboardRefillActivity = () => {
  return api.get("/dashboard/refill-activity/monthly");
};

export const getDashboardConfig = (target?: string | null | { branchId?: string | null; roleId?: string | null }) => {
  const params = typeof target === "object"
    ? {
        ...(target?.branchId ? { branchId: target.branchId } : {}),
        ...(target?.roleId ? { roleId: target.roleId } : {}),
      }
    : target
      ? { branchId: target }
      : undefined;

  return api.get("/dashboard/config", {
    params,
  });
};

export const updateDashboardConfig = (payload: any, target?: string | null | { branchId?: string | null; roleId?: string | null }) => {
  const params = typeof target === "object"
    ? {
        ...(target?.branchId ? { branchId: target.branchId } : {}),
        ...(target?.roleId ? { roleId: target.roleId } : {}),
      }
    : target
      ? { branchId: target }
      : undefined;

  return api.patch("/dashboard/config", payload, {
    params,
  });
};
