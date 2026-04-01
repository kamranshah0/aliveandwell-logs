"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import DashbaordCard from "@/components/molecules/DashbaordCard";
import DashboardStatsCardSkeleton from "@/components/skeletons/DashboardStatsCardSkeleton";
import RecentReports from "./RecentReports";
import DateRangePopup from "./components/DateRangePopup";
import { Button } from "@/components/ui/button";

import {
  CircleAlert,
  Clock,
  FileText,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { RiCapsuleLine } from "react-icons/ri";

import { getReportStats } from "@/api/report.api";
import { generateRefillSummaryReport } from "@/services/refillSummaryReport.service";
import { notify } from "@/components/ui/notify";
import { generateLowSupplySummaryReport } from "@/services/lowSupplyReport.service";
import { generateUrgentRefillsSummaryReport } from "@/services/urgentRefillReport.service";

type ReportType = "refill" | "low" | "urgent";
type FileFormat = "csv" | "pdf";

const ReportDashboard = () => {
  const queryClient = useQueryClient();
  const [activePopup, setActivePopup] = useState<ReportType | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>("csv");

  /* =============================
      📊 DASHBOARD STATS
     ============================= */
  const {
    data: reportStats,
    isLoading: isStatsLoading,
    refetch: refetchReportStats,
  } = useQuery({
    queryKey: ["reportStats"],
    queryFn: async () => {
      const res = await getReportStats();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  /* =============================
      📄 GENERATE REPORT
     ============================= */
  const generateReportMutation = useMutation({
    mutationFn: ({
      type,
      from,
      to,
      format,
    }: {
      type: ReportType;
      from: string;
      to: string;
      format: FileFormat;
    }) => {
      if (type === "refill") {
        return generateRefillSummaryReport(from, to, format);
      }

      if (type === "low") {
        return generateLowSupplySummaryReport(from, to, format);
      }

      if (type === "urgent") {
        return generateUrgentRefillsSummaryReport(from, to, format);
      }

      throw new Error("Invalid report type");

      return generateRefillSummaryReport(from, to, format);
    },

    onSuccess: () => {
      notify.success("Refill Summary report generated & uploaded successfully");
      refetchReportStats();
      queryClient.invalidateQueries({ queryKey: ["recentReports"] });
    },

    onError: (err: any) => {
      notify.error(err.message || "Failed to generate report");
    },

    onSettled: () => {
      setActivePopup(null);
    },
  });

  /* =============================
      🧠 HELPERS
     ============================= */
  const openPopup = (type: ReportType, format: FileFormat) => {
    setSelectedFormat(format);
    setActivePopup(type);
  };

  const reportTitle = (type: ReportType) => {
    switch (type) {
      case "refill":
        return "Refill Summary";
      case "low":
        return "Low Supply (1 Day Left)";
      case "urgent":
        return "Urgent Refills (0 Remaining)";
      default:
        return "Report";
    }
  };

  /* =============================
      🖥️ UI
     ============================= */
  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Reports & Analytics"
        description="Generate insights and download healthcare reports"
      />

      {/* =============================
          📊 STATS
      ============================= */}
      {isStatsLoading ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardStatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          <DashbaordCard
            title="Total Patients"
            value={reportStats?.totalPatients ?? 0}
            iconClassName="bg-primary/10"
            icon={<UsersRound className="size-5 text-primary" />}
          />
          <DashbaordCard
            title="Active Prescriptions"
            value={reportStats?.activePrescriptions ?? 0}
            iconClassName="bg-primary/10"
            icon={<RiCapsuleLine className="size-5 text-primary" />}
          />
          <DashbaordCard
            title="Refills This Month"
            value={reportStats?.refillsThisMonth ?? 0}
            iconClassName="bg-secondary/10"
            icon={<TrendingUp className="size-5 text-secondary" />}
          />
          <DashbaordCard
            title="Reports Generated"
            value={reportStats?.reportsGenerated ?? 0}
            iconClassName="bg-primary/10"
            icon={<FileText className="size-5 text-primary" />}
          />
        </div>
      )}

      {/* =============================
          📄 REPORT CARDS
      ============================= */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {/* Refill Summary */}
        <div className="bg-surface-0 border border-primary rounded-xl p-6 flex gap-4">
          <div className="bg-primary/10 size-12 flex items-center justify-center rounded-lg">
            <FileText className="size-5 text-primary" />
          </div>
          <div className="flex-1 justify-between flex flex-col">
            <div>
              <h3 className="font-medium">Refill Summary</h3>
              <p className="text-sm text-text-low-em">
                Monthly report of all medication refills
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                onClick={() => openPopup("refill", "csv")}
                disabled={generateReportMutation.isPending}
              >
                Generate CSV
              </Button>
              <Button
                onClick={() => openPopup("refill", "pdf")}
                disabled={generateReportMutation.isPending}
              >
                Generate PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Low Supply Card */}
        <div className="bg-surface-0 border border-yellow rounded-xl drop-shadow-sm p-6 flex gap-4">
          <div className="bg-yellow/10 size-12 flex items-center justify-center rounded-lg">
            <Clock className="size-5 text-yellow" />
          </div>
          <div className="flex-1 justify-between flex flex-col">
            <div>
              <h3 className="font-medium text-base text-text-high-em">
                Low Supply (1 Day Left)
              </h3>
              <p className="text-text-low-em text-sm font-light pr-3">
                Patients who will run out of medication tomorrow
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              <Button  variant="outline" onClick={() => openPopup("low", "csv")}>
                Generate CSV
              </Button>
              <Button onClick={() => openPopup("low", "pdf")}>
                Generate PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Urgent Refills Card */}
        <div className="bg-surface-0 border border-danger rounded-xl drop-shadow-sm p-6 flex gap-4">
          <div className="bg-danger/10 size-12 flex items-center justify-center rounded-lg">
            <CircleAlert className="size-5 text-danger" />
          </div>
          <div className="flex-1 justify-between flex flex-col">
            <div>

            <h3 className="font-medium text-base text-text-high-em">
              Urgent Refills (0 Remaining)
            </h3>
            <p className="text-text-low-em text-sm font-light pr-3">
              Patients requiring immediate refill approval
            </p>
            </div>
            <div className="flex gap-2 mt-3">
              <Button  variant="outline" onClick={() => openPopup("urgent", "csv")}>
                Generate CSV
              </Button>
              <Button onClick={() => openPopup("urgent", "pdf")}>
                Generate PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* =============================
          📆 DATE RANGE POPUP
      ============================= */}
      {activePopup && (
        <DateRangePopup
          isOpen
          reportType={reportTitle(activePopup)}
          isLoading={generateReportMutation.isPending}
          onClose={() => setActivePopup(null)}
          onGenerate={(from, to) =>
            generateReportMutation.mutate({
              type: activePopup,
              from,
              to,
              format: selectedFormat,
            })
          }
        />
      )}

      <RecentReports />
    </MainWrapper>
  );
};

export default ReportDashboard;
