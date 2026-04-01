import { type JSX } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Bell,
  CircleAlert,
  CircleCheck,
  Clock,
  Package,
  X,
} from "lucide-react";

/* ===================== TYPES ===================== */

export type NotificationIconType =
  | "alert"
  | "package"
  | "success"
  | "clock"
  | "bell";

export type BadgeVariantType =
  | "danger"
  | "warning"
  | "secondary"
  | "default"
  | "success"
  | "destructive"
  | "info"
  | "outline";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: NotificationIconType;
  iconBg: string;
  badgeText: string;
  badgeVariant: BadgeVariantType;
  module: string;
  type: string;
}

interface Props {
  notifications: NotificationItem[];
  loading?: boolean;
  onRemove?: (id: string) => void;
  onClick?: (n: NotificationItem) => void;
}

/* ===================== ICON MAP ===================== */

const iconMap: Record<NotificationIconType, JSX.Element> = {
  alert: <CircleAlert className="size-6 text-danger-500" />,
  package: <Package className="size-6 text-yellow" />,
  success: <CircleCheck className="size-6 text-secondary" />,
  clock: <Clock className="size-6 text-yellow" />,
  bell: <Bell className="size-6 text-primary" />,
};

/* ===================== ANIMATION ===================== */

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 },
};

/* ===================== COMPONENT ===================== */

const NotificationCard: React.FC<Props> = ({
  notifications,
  loading,
  onRemove,
  onClick,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-surface-1 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="py-14 flex flex-col items-center text-center">
        <Bell className="size-12 text-text-low-em mb-2" />
        <p className="font-medium">No Notifications</p>
        <p className="text-sm text-text-low-em">You're all caught up 🎉</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          variants={item}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={() => onClick?.(n)}
          className={`cursor-pointer flex gap-4 p-4 rounded-xl border ${
            n.unread
              ? "border-outline-high-em bg-primary/10"
              : "border-outline-med-em bg-surface-0"
          }`}
        >
          <div className="size-10 flex items-center justify-center rounded-xl bg-surface-0">
            {iconMap[n.icon]}
          </div>

          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                {n.title}
                {n.unread && <span className="size-2 bg-primary rounded-full" />}
              </h4>

              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(n.id);
                }}
              >
                <X />
              </Button>
            </div>

            <p className="text-sm text-text-low-em font-light">{n.message}</p>

            <div className="flex gap-2 mt-1 items-center">
              <span className="text-sm text-text-low-em font-light">{n.time}</span>
              <Badge variant={n.badgeVariant} className="text-xs">{n.badgeText}</Badge>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default NotificationCard;
