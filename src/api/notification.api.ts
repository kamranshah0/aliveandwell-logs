import { api } from "@/api/axios";

export const fetchNotifications = (limit = 50) =>
  api.get("/admin/notifications", { params: { limit } });

export const markNotificationRead = (id: string) =>
  api.put(`/admin/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.put("/admin/notifications/read-all");

export const deleteAllNotifications = () => api.delete("/admin/notifications");

export const deleteNotification = (id: string) =>
  api.delete(`/admin/notifications/${id}`);
