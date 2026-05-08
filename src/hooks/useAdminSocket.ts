// src/hooks/useAdminSocket.ts
import { useEffect } from "react";
import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/ui/notify";
import { useNotificationStore } from "@/stores/notification.store";
import { useImportStore } from "@/stores/import.store";
let socket: any = null;

export const useAdminSocket = () => {
  const queryClient = useQueryClient();
    const triggerNew = useNotificationStore((s) => s.triggerNew);


  useEffect(() => {
    if (socket) return;

    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "https://aliveandwell-api.venturequeue.com";
    socket = io(`${socketUrl}/admin`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Admin socket connected");
    });

    socket.on("new-refill-request", (data: any) => {
      console.log("🔔 New refill request", data);



       triggerNew();
      // 🔁 Refresh notification list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["navbarNotifications"] });

      // 🔔 In-app toast
      notify.info(
        "New Refill Request",
        "A patient has requested a medication refill",
        5000
      );

      // 🌐 Browser Notification
      if ("Notification" in window && Notification.permission === "granted") {
        const n = new Notification("New Refill Request", {
          body: "A patient has requested a medication refill",
          icon: "https://cdn-icons-png.flaticon.com/512/2966/2966480.png",
          data: {
            url: "/medication-refill-requests",
          },
        });

        n.onclick = () => {
          window.focus();
          window.location.href = n.data.url;
          n.close();
        };
      }
    });

    socket.on("import-progress", (data: any) => {
      useImportStore.getState().setProgress(data);
    });

    socket.on("disconnect", () => {
      console.log("Admin socket disconnected");
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [queryClient]);
};
