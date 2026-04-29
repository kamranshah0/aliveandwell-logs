import { api } from "./axios";

export const getDailyLogs = () => api.get("/daily-log");

export const createDailyLog = (payload: any) => api.post("/daily-log", payload);

export const getDailyLogById = (id: string) => api.get(`/daily-log/${id}`);

export const bulkImportDailyLogsCsv = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/daily-log/bulk-import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const exportDailyLogsCsv = () => api.get("/daily-log/export/csv");

export const updateDailyLog = (id: string, payload: any) => api.patch(`/daily-log/${id}`, payload);

export const deleteDailyLog = (id: string) => api.delete(`/daily-log/${id}`);
export const getDailyLogStats = () => api.get("/daily-log/stats");
export const getAdminDailyLogReports = (params?: { startDate?: string; endDate?: string }) => 
  api.get("/daily-log/admin-reports", { params });

// FIELD MANAGEMENT
export const getDailyLogFields = () => api.get("/daily-log/fields");
export const createDailyLogField = (payload: any) => api.post("/daily-log/fields", payload);
export const updateDailyLogField = (id: string, payload: any) => api.patch(`/daily-log/fields/${id}`, payload);
export const deleteDailyLogField = (id: string) => api.delete(`/daily-log/fields/${id}`);
export const reorderDailyLogFields = (ids: string[]) => api.post("/daily-log/fields/reorder", { ids });
