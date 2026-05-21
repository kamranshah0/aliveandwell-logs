"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchNotifications } from "@/api/notification.api";
import { mapNotification } from "@/utils/notificationMapper";
import { useNotificationStore } from "@/stores/notification.store";

let initialized = false;

export const useInitNotifications = (enabled = true) => {
  const queryClient = useQueryClient();
  const setHasUnread = useNotificationStore((s) => s.setHasUnread);

  useEffect(() => {
    if (!enabled) return;
    if (initialized) return;
    initialized = true;

    const init = async () => {
      try {
        const res = await fetchNotifications(50);
        const notifications = res.data.data.map(mapNotification);

        // ✅ store in react-query cache
        queryClient.setQueryData(["notifications"], notifications);

        // ✅ derive unread
        const hasUnread = notifications.some((n: any) => n.unread);
        setHasUnread(hasUnread);
      } catch (e) {
        initialized = false;
        console.error("Failed to init notifications", e);
      }
    };

    init();
  }, [enabled, queryClient, setHasUnread]);
};
