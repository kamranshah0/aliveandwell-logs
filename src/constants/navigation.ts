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
  {
    name: "Log Reports",
    path: "/log-reports",
    permission: "admin.view",
  },
  {
    name: "Form Settings",
    path: "/daily-log-config",
    permission: "admin.view",
  },
];
