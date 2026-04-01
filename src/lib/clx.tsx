// utils/clx.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function clx(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
