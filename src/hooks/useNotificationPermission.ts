// src/hooks/useNotificationPermission.ts
import { useEffect } from "react";

export const useNotificationPermission = () => {
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification permission:", permission);
      });
    }
  }, []);
};
