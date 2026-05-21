// src/hooks/useAdminSocket.ts
import { useEffect } from "react";
import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/ui/notify";
import { useNotificationStore } from "@/stores/notification.store";
import { useImportStore } from "@/stores/import.store";

let socket: any = null;

export const useAdminSocket = (enabled = true) => {
  const queryClient = useQueryClient();
  const triggerNew = useNotificationStore((s) => s.triggerNew);

  useEffect(() => {
    if (!enabled) {
      socket?.disconnect();
      socket = null;
      return;
    }

    if (socket) return;

    const socketUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "https://aliveandwell-api.venturequeue.com";

    socket = io(`${socketUrl}/admin`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      if (import.meta.env.DEV) {
        console.log("Admin socket connected");
      }
    });

    socket.on("new-refill-request", (data: any) => {
      if (import.meta.env.DEV) {
        console.log("New refill request", data);
      }

      triggerNew();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbarNotifications"] });

      notify.info(
        "New Refill Request",
        "A patient has requested a medication refill",
        5000
      );

      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification("New Refill Request", {
          body: "A patient has requested a medication refill",
          icon: "https://cdn-icons-png.flaticon.com/512/2966/2966480.png",
          data: {
            url: "/medication-refill-requests",
          },
        });

        notification.onclick = () => {
          window.focus();
          window.location.href = notification.data.url;
          notification.close();
        };
      }
    });

    socket.on("import-progress", (data: any) => {
      useImportStore.getState().setProgress(data);
    });

    socket.on("disconnect", () => {
      if (import.meta.env.DEV) {
        console.log("Admin socket disconnected");
      }
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [enabled, queryClient, triggerNew]);
};
