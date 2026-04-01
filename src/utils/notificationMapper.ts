import { formatDistanceToNow } from "date-fns";
import type { NotificationItem } from "@/pages/admin/notifications/NotificationCard";

export const mapNotification = (n: any): NotificationItem => ({
  id: n.id,
  title: n.title,
  message: n.message,
  time: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }),
  unread: !n.isRead,
  icon: n.module === "REFILL" ? "alert" : "bell",
  iconBg: "bg-surface-0",
  badgeText: n.type,
  badgeVariant: n.type === "HIGH" ? "danger" : "default",
  module: n.module,
  type: n.type,
});
