// src/constants/navigation.ts

export const DASHBOARD_PATH = "/";

export interface NavItem {
  name: string;
  path: string;
  permission: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    path: "/",
    permission: "admin.view",
  },
  {
    name: "Daily Logs",
    path: "/daily-log",
    permission: "dailyLog.read",
  },
];
