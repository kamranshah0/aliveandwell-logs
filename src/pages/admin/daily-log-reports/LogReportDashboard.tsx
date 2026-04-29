import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import { useQuery } from "@tanstack/react-query";
import { getAdminDailyLogReports, getDailyLogFields } from "@/api/daily-log.api";
import { ClipboardPlus, CalendarIcon, BarChart3 } from "lucide-react";
import ReportBarChart from "./ReportBarChart";
import Papa from "papaparse";
import { toast } from "sonner";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

  const { data: fieldsRes } = useQuery({
    queryKey: ["dailyLogFields"],
    queryFn: getDailyLogFields,
  });
  const fields = fieldsRes?.data?.data || [];

  const handleSingleExport = (title: string, categoryKey: string) => {
    if (!adminStats || !adminStats.rawLogs || !adminStats.rawLogs.length) {
      toast.error("No data to export");
      return;
    }

    try {
      const relevantLogs = adminStats.rawLogs.filter((log: any) => {
        const val = log[categoryKey] ?? log.additionalData?.[categoryKey];
        return !!val;
      });
      
      if (!relevantLogs.length) {
        toast.error("No data available for this category");
        return;
      }

      const exportData = relevantLogs.map((log: any) => {
        const row: any = {};
        
        fields.forEach((f: any) => {
          let val = log[f.name] ?? log.additionalData?.[f.name];
          
          if (f.type === "checkbox") {
            val = val ? "YES" : "NO";
          }
          
          row[f.label] = val ?? "";
        });

        return row;
      });

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${title.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${title} report exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${title} report`);
    }
  };

  const dynamicReports = adminStats?.dynamicReports || [];

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

      {/* DYNAMIC REPORTS GRID */}
      <div className="grid lg:grid-cols-2 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
          ))
        ) : (
          dynamicReports.map((report: any, index: number) => (
            <div key={report.name} className="flex flex-col gap-4">
              <ReportBarChart
                data={report.data}
                title={`Entries by ${report.label}`}
                icon={<BarChart3 className={`size-6 ${index % 2 === 0 ? 'text-primary' : 'text-purple-600'}`} />}
                color={index % 2 === 0 ? "#2563EB" : "#9333EA"}
                onExport={() => handleSingleExport(report.label, report.name)}
              />
            </div>
          ))
        )}
      </div>

      {dynamicReports.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <BarChart3 className="size-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Dynamic Reports Found</h3>
          <p className="text-sm text-gray-400">Add fields and enable "Show in Report" in Settings to see charts here.</p>
        </div>
      )}

    </MainWrapper>
  );
};

export default LogReportDashboard;
