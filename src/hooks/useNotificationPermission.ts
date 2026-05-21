// src/hooks/useNotificationPermission.ts
import { useEffect } from "react";

export const useNotificationPermission = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (import.meta.env.DEV) {
          console.log("Notification permission:", permission);
        }
      });
    }
  }, [enabled]);
};
