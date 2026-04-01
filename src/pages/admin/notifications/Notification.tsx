"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { Button } from "@/components/ui/button";
import NotificationCard from "./NotificationCard";
import { notify } from "@/components/ui/notify";
import { useNotificationStore } from "@/stores/notification.store";

import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/api/notification.api";
import { mapNotification } from "@/utils/notificationMapper";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
    const setHasUnread = useNotificationStore((s) => s.setHasUnread);



    const syncUnreadFromCache = (
  queryClient: any,
  setHasUnread: (v: boolean) => void
) => {
  const notifications =
    (queryClient.getQueryData(["notifications"]) as any[]) || [];

  const hasUnread = notifications.some((n) => n.unread === true);
  setHasUnread(hasUnread);
};


  /* =========================
      🔔 FETCH
     ========================= */
  const { data = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetchNotifications(50);
      return res.data.data.map(mapNotification);
    },
  });

  /* =========================
      ⚡ OPTIMISTIC: READ ONE
     ========================= */
  const readOneMutation = useMutation({
    mutationFn: markNotificationRead,
    onError: () => {
      notify.error("Failed to mark notification as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  /* =========================
      ⚡ OPTIMISTIC: READ ALL
     ========================= */
  const readAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onError: () => {
      notify.error("Failed to mark all as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  /* =========================
      ⚡ OPTIMISTIC: DELETE ONE
     ========================= */
  const deleteOneMutation = useMutation({
    mutationFn: deleteNotification,
    onError: () => {
      notify.error("Failed to delete notification");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  /* =========================
      ⚡ OPTIMISTIC: CLEAR ALL
     ========================= */
  const clearAllMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onError: () => {
      notify.error("Failed to clear notifications");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  /* =========================
      🧠 HANDLERS (INSTANT UI)
     ========================= */
  const handleClick = (n: any) => {
    // 🔥 INSTANT UI UPDATE
    queryClient.setQueryData(["notifications"], (old: any[]) =>
      old.map((item) =>
        item.id === n.id ? { ...item, unread: false } : item
      )
    );

    // 🔁 BACKGROUND REQUEST
    if (n.unread) {
      readOneMutation.mutate(n.id);
    }

      syncUnreadFromCache(queryClient, setHasUnread);

    // 🚦 navigation hook
    console.log("NAVIGATE:", n.module);

    if (n.module.toLowerCase() === "refill") {
      navigate("/refills");
    } else if (n.module.toLowerCase() === "patient") {
      navigate("/patients");
    }

  };

  const markAllAsRead = () => {
    queryClient.setQueryData(["notifications"], (old: any[]) =>
      old.map((n) => ({ ...n, unread: false }))
    );

      setHasUnread(false);
    readAllMutation.mutate();
  };

  const clearAll = () => {
    queryClient.setQueryData(["notifications"], []);
    setHasUnread(false);
    clearAllMutation.mutate();
  };

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Notifications"
        description="Stay updated with patient and medication alerts"
        actionContent={
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        }
      />

      <NotificationCard
        loading={isLoading}
        notifications={data}
        onClick={handleClick}
        onRemove={(id) => {
          // instant UI
          queryClient.setQueryData(["notifications"], (old: any[]) =>
            old.filter((n) => n.id !== id)
          );
          deleteOneMutation.mutate(id);
            syncUnreadFromCache(queryClient, setHasUnread);
        }}
      />
    </MainWrapper>
  );
};

export default Notification;
