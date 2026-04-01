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
