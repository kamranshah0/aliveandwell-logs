"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileText } from "lucide-react";
import { getRecentReports } from "@/api/report.api";
import RecentReportSkeleton from "@/components/skeletons/RecentReportSkeleton";
import { formatDate } from "@/utils/dateUtils";

const typeLabel = (type: string) => {
  switch (type) {
    case "refill_summary":
      return "Refills";
    case "low_supply":
      return "Low Supply";
    case "urgent_refills":
      return "Urgent";
    default:
      return "Report";
  }
};

function RecentReports() {
  const {
    data,
    isLoading, 
  } = useQuery({
    queryKey: ["recentReports"],
    queryFn: async () => {
      const res = await getRecentReports(10);
      return res.data.data.reports;
    },
  });

  return (
    <div className="p-6 rounded-xl drop-shadow-sm w-full bg-surface-0">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Recent Reports</h2>
        <Button variant="outline" size="sm">
          <Calendar className="size-5 mr-1" /> View All
        </Button>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <RecentReportSkeleton key={i} />
          ))
        ) : data?.length === 0 ? (
          <div className="text-center py-6 text-text-low-em">
            No reports generated yet
          </div>
        ) : (
          data.map((report: any) => (
            <div
              key={report.id}
              className="flex justify-between items-center bg-surface-1/70 p-4 rounded-lg"
            >
              <div className="flex gap-3">
                <div className="bg-primary/10 size-12 flex items-center justify-center rounded-lg">
                  <FileText className="size-5 text-primary" />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-text-high-em font-medium">
                    {report.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-low-em font-light">
                      {formatDate(report.createdAt)}
                    </span>

                    <Badge variant="success">
                      {typeLabel(report.type)}
                    </Badge>

                    <span className="text-xs text-text-low-em">
                      {report.fileSize}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() =>
                  window.open(report.fileUrl, "_blank")
                }
              >
                <Download className="size-5" />
              </Button>
            </div>
          ))
        )}



        

      </div>
    </div>
  );
}

export default RecentReports;
