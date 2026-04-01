// src/stores/notification.store.ts
import { create } from "zustand";

type NotificationStore = {
  hasUnread: boolean;
  setHasUnread: (value: boolean) => void;
  triggerNew: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  hasUnread: false,

  setHasUnread: (value) => set({ hasUnread: value }),

  triggerNew: () => set({ hasUnread: true }),
}));
