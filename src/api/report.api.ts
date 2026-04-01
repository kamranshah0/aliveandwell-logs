import { api } from "./axios";

// Report Statistics
export const getReportStats = () => 
  api.get("/admin/reports/refills/dashboard-stats");

 

// Helper function to get appropriate API based on report type
export const getReportData = (reportType: string, fromDate: string, toDate: string) => {
  switch (reportType) {
    case 'refill':
      return generateRefillSummary(fromDate, toDate);
    case 'low':
      return generateLowSupplyReport(fromDate, toDate);
    case 'urgent':
      return generateUrgentRefillsReport(fromDate, toDate);
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }
};

 
/// new 

export const generateLowSupplyReport = (
  from: string,
  to: string,
  days = 3 // 🔒 fixed
) =>
  api.get("/admin/reports/refills/low-supply", {
    params: { from, to, days },
  });

export const generateUrgentRefillsReport = (
  from: string,
  to: string,
  days = 7 // 🔒 fixed
) =>
  api.get("/admin/reports/refills/urgent", {
    params: { from, to, days },
  });


export const generateRefillSummary = (from: string, to: string) =>
  api.get("/admin/reports/refills/summary", {
    params: { from, to },
  });

export const uploadReportFile = (formData: FormData) =>
  api.post("/admin/reports/storage/upload", formData);


export const getRecentReports = (limit = 10) =>
  api.get("/admin/reports/storage", {
    params: { limit },
  });