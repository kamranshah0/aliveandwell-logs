import { format } from "date-fns";

/**
 * Standardizes date formatting to MM/DD/YY as requested by the user.
 * @param date - The date to format (string, number, or Date object)
 * @returns Formatted date string or "-" if invalid
 */
export const formatDate = (date: string | number | Date | null | undefined): string => {
  if (!date) return "-";
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return format(d, "MM/dd/yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};
