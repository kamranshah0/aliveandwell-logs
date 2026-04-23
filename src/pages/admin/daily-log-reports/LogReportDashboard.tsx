import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import TitelMd from "@/components/molecules/TiteMd";
import DashbaordDetailCard from "@/components/molecules/DashbaordDetailCard";
import { useQuery } from "@tanstack/react-query";
import { getAdminDailyLogReports } from "@/api/daily-log.api";
import { Stethoscope, Pill, Syringe, ClipboardPlus, CalendarIcon } from "lucide-react";
import ReportBarChart from "./ReportBarChart";
import Papa from "papaparse";
import { notify } from "@/components/ui/notify";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { format } from "date-fns";

const LogReportDashboard = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: adminStats, isLoading } = useQuery({
    queryKey: ["adminDailyLogReports", startDate, endDate],
    queryFn: async () => {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();
      const res = await getAdminDailyLogReports(params);
      return res.data.data;
    },
  });
  const handleSingleExport = (title: string, categoryKey: string) => {
    if (!adminStats || !adminStats.rawLogs || !adminStats.rawLogs.length) {
      notify.error("No data to export");
      return;
    }

    try {
      const relevantLogs = adminStats.rawLogs.filter((log: any) => !!log[categoryKey]);
      
      if (!relevantLogs.length) {
        notify.error("No data available for this category");
        return;
      }

      const exportData = relevantLogs.map((log: any) => ({
        "Date": log.date || "",
        "Location": log.branch?.name || "Unknown",
        "Rep": log.representative || "",
        "Last Name": log.lastName || "",
        "First Name": log.firstName || "",
        "DOB": log.dob || "",
        "Doctor/NP": log.doctorNpName || "",
        "Lab": log.lab || "",
        "Lab Rep": log.labRep || "",
        "New": log.newPatient ? "YES" : "NO",
        "Enrolled": log.enrolled ? "YES" : "NO",
        "Addr.": log.proofOfAddress || "",
        "Elig.": log.eligibilityCheck || "",
        "Ins.": log.insuranceCheck || "",
        "Visit Type": log.visitType || "",
        "Services": log.visitServices || "",
        "Copay": log.copayAmount || "",
        "Source": log.copaySource || "",
        "Receipt": log.copayReceiptNumber || "",
        "Marketing": log.marketingSource || "",
        "Next Appt": log.nextApptDate || "",
        "Can. Fee": log.adviseCancellationFee || "",
        "Prog.": log.adviseProgram || "",
        "DH Rep": log.dhFormRep || "",
        "DH Form": log.dhFormNumber || "",
        "Dr. Ordered": log.drOrdered || "",
        "Order Type": log.orderType || "",
        "Pharmacy": log.pharmacy || ""
      }));

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${title.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      notify.success(`${title} report exported successfully`);
    } catch (error) {
      notify.error(`Failed to export ${title} report`);
    }
  };

  return (
    <MainWrapper className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <MainHeader
          title="Daily Log Reports"
          description="Detailed analytical breakdown of log entries by various categories."
        />

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CalendarIcon className="size-4 text-gray-400" />
            Filter by Date:
          </div>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { size: "small" } }}
          />
        </div>
      </div>

      {/* VISIT TYPE & VISIT SERVICES */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visit Type */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <ReportBarChart
              data={adminStats?.entriesByVisitType || []}
              title="Entries by Visit Type"
              icon={<ClipboardPlus className="size-6 text-blue-600" />}
              color="#2563EB" // blue-600
              onExport={() => handleSingleExport("Visit Type", "visitType")}
            />
          )}
        </div>

        {/* Visit Services */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <ReportBarChart
              data={adminStats?.entriesByVisitServices || []}
              title="Entries by Visit Services"
              icon={<Syringe className="size-6 text-purple-600" />}
              color="#9333EA" // purple-600
              onExport={() => handleSingleExport("Visit Services", "visitServices")}
            />
          )}
        </div>
      </div>

      {/* DR ORDERED & PHARMACY */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Dr Ordered */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <ReportBarChart
              data={adminStats?.entriesByDrOrdered || []}
              title="Entries by Dr. Ordered"
              icon={<Stethoscope className="size-6 text-green-600" />}
              color="#16A34A" // green-600
              onExport={() => handleSingleExport("Dr Ordered", "drOrdered")}
            />
          )}
        </div>

        {/* Pharmacy */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <ReportBarChart
              data={adminStats?.entriesByPharmacy || []}
              title="Entries by Pharmacy"
              icon={<Pill className="size-6 text-orange-600" />}
              color="#EA580C" // orange-600
              onExport={() => handleSingleExport("Pharmacy", "pharmacy")}
            />
          )}
        </div>
      </div>

    </MainWrapper>
  );
};

export default LogReportDashboard;
