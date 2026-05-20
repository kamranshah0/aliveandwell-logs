import { useEffect, useState } from "react";
import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import DashbaordCard from "@/components/molecules/DashbaordCard";
import { ClipboardList, UsersRound, Building2, UserPlus, HeartPulse } from "lucide-react";
import TitelMd from "@/components/molecules/TiteMd";
import DashbaordDetailCard from "@/components/molecules/DashbaordDetailCard";
import { useQuery } from "@tanstack/react-query";
import { getAdminDailyLogReports } from "@/api/daily-log.api";
import { getDashboardConfig } from "@/api/dashboard.api";
import DashboardStatsCardSkeleton from "@/components/skeletons/DashboardStatsCardSkeleton";
import PharmacyCardSkeleton from "@/components/skeletons/PharmacyCardSkeleton";
import DailyActivityChart from "./DailyActivityChart";
import { format } from "date-fns";
import { useAuth } from "@/auth/useAuth";

const defaultVisibleCards = {
  entriesThisMonth: true,
  totalEntries: true,
  newPatients: true,
  existingPatients: true,
  refillPrescriptions: true,
  newPrescriptions: true,
  assistantProgram: true,
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const userBranchId = user?.user?.branchId || user?.branchId || null;
  const username = user?.user?.username || user?.username || user?.user?.id || user?.id;
  const isHiddenAdmin = username === "sagar";
  const dashboardConfigBranchId = isHiddenAdmin ? null : userBranchId;

  const { data: configRes, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["dashboardConfig", dashboardConfigBranchId],
    queryFn: () => getDashboardConfig(dashboardConfigBranchId),
    enabled: Boolean(userBranchId || isHiddenAdmin),
  });

  const globalConfig = configRes?.data || {};

  const getReportParams = (dashboardMode: "cards" | "charts") => {
    const resolvedEndDate = globalConfig.endDate === "today"
      ? format(new Date(), "yyyy-MM-dd")
      : (globalConfig.endDate || "");
    const reportBranchId =
      globalConfig.location === "all" ? undefined : globalConfig.location;

    return {
      startDate: globalConfig.startDate || "",
      endDate: resolvedEndDate,
      branchId: reportBranchId,
      showLast24Hours: globalConfig.showLast24Hours,
      includeRawLogs: false,
      dashboardMode,
    };
  };

  const { data: cardStats, isLoading: isCardsQueryLoading } = useQuery({
    queryKey: ["adminDashboardCards", dashboardConfigBranchId, globalConfig.startDate, globalConfig.endDate, globalConfig.location, globalConfig.showLast24Hours],
    queryFn: async () => {
      const res = await getAdminDailyLogReports(getReportParams("cards"));
      return res.data.data;
    },
    enabled: Boolean(configRes && (userBranchId || isHiddenAdmin)),
    staleTime: 5 * 60 * 1000,
  });

  const { data: chartStats, isLoading: isChartsQueryLoading, isFetching: isChartsFetching } = useQuery({
    queryKey: ["adminDashboardCharts", dashboardConfigBranchId, globalConfig.startDate, globalConfig.endDate, globalConfig.location, globalConfig.showLast24Hours],
    queryFn: async () => {
      const res = await getAdminDailyLogReports(getReportParams("charts"));
      return res.data.data;
    },
    enabled: Boolean(cardStats && configRes && (userBranchId || isHiddenAdmin)),
    staleTime: 5 * 60 * 1000,
  });

  const visibleCards = {
    ...defaultVisibleCards,
    ...(globalConfig.visibleCards || {}),
  };
  
  const [branchSearch, setBranchSearch] = useState("");
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    if (!chartStats) {
      setChartsReady(false);
      return;
    }

    setChartsReady(false);
    const timer = window.setTimeout(() => setChartsReady(true), 450);
    return () => window.clearTimeout(timer);
  }, [chartStats]);

  const isCardsLoading = isLoadingConfig || (isCardsQueryLoading && !cardStats);
  const isChartsLoading = isCardsLoading || isChartsQueryLoading || isChartsFetching || !chartsReady;
  const totalEntries = cardStats?.totalEntries || 0;
  const newPatients = cardStats?.newPatients || 0;
  const dynamicReports = cardStats?.dynamicReports || [];
  const countByFieldValue = (fieldName: string, targetValue: string) =>
    dynamicReports
      .find((report: any) => report.name === fieldName)
      ?.data?.find(
        (item: any) =>
          String(item.name || "").trim().toLowerCase() === targetValue.toLowerCase()
      )?.count || 0;

  const baseMetricCards = [
    {
      key: "entriesThisMonth",
      title: "Entries This Month",
      value: cardStats?.currentMonthEntries || 0,
      iconClassName: "bg-primary/10",
      icon: <ClipboardList className="size-5 text-primary" />,
    },
    {
      key: "totalEntries",
      title: "Total Entries",
      value: totalEntries,
      iconClassName: "bg-green-50",
      icon: <UsersRound className="size-5 text-green-600" />,
    },
    {
      key: "newPatients",
      title: "New Patients",
      value: newPatients,
      iconClassName: "bg-secondary/10",
      icon: <UserPlus className="size-5 text-secondary" />,
    },
    {
      key: "existingPatients",
      title: "Existing Patients",
      value: Math.max(totalEntries - newPatients, 0),
      iconClassName: "bg-indigo-50",
      icon: <UsersRound className="size-5 text-indigo-600" />,
    },
    {
      key: "refillPrescriptions",
      title: "Refills Prescription",
      value: countByFieldValue("drOrdered", "Refill Prescription"),
      iconClassName: "bg-amber-50",
      icon: <ClipboardList className="size-5 text-amber-600" />,
    },
    {
      key: "newPrescriptions",
      title: "NEW Prescription",
      value: countByFieldValue("drOrdered", "New Prescription"),
      iconClassName: "bg-emerald-50",
      icon: <ClipboardList className="size-5 text-emerald-600" />,
    },
  ].filter((card) => visibleCards[card.key as keyof typeof visibleCards]);

  const serviceCards = (globalConfig.visitServices || []).map((service: string) => ({
    key: `service-${service}`,
    title: service,
    value: countByFieldValue("visitServices", service),
    iconClassName: "bg-violet-50",
    icon: <HeartPulse className="size-5 text-violet-600" />,
  }));

  const typeCards = (globalConfig.visitTypes || []).map((type: string) => ({
    key: `type-${type}`,
    title: type,
    value: countByFieldValue("visitType", type),
    iconClassName: "bg-rose-50",
    icon: <HeartPulse className="size-5 text-rose-600" />,
  }));

  const metricCards = [...baseMetricCards, ...serviceCards, ...typeCards];
  const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
    <div
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      style={{ minHeight: height }}
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="size-12 animate-pulse rounded-xl bg-gray-100" />
        <div className="space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-56 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div className="flex h-[220px] items-end gap-3">
        {[42, 68, 54, 78, 38, 62, 48, 72].map((barHeight, index) => (
          <div
            key={index}
            className="flex-1 animate-pulse rounded-t-md bg-gray-100"
            style={{ height: `${barHeight}%` }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <MainWrapper className="flex flex-col gap-8">
      <MainHeader
        title="Admin Dashboard"
        description="Comprehensive overview of all log entries across the organization."
      />

      {!userBranchId && !isHiddenAdmin && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No branch is assigned to this user, so branch dashboard settings cannot be loaded.
        </div>
      )}

      {/* TOP METRICS */}
      <div className="space-y-4">
        {isCardsLoading ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <DashboardStatsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {metricCards.map((card) => (
              <DashbaordCard
                key={card.key}
                title={card.title}
                value={card.value}
                iconClassName={card.iconClassName}
                icon={card.icon}
              />
            ))}
          </div>
        )}
      </div>

      {/* MONTHLY TREND CHART */}
      <div className="grid grid-cols-1">
        {isChartsLoading ? (
          <ChartSkeleton height={340} />
        ) : (
          <DailyActivityChart 
            data={chartStats?.entriesByMonth?.map((item: any) => ({
              displayDate: item.name,
              count: item.count
            })) || []} 
            title="Total Entries by Month"
            description="Monthly entry trends"
          />
        )}
      </div>

      {/* DETAILED BREAKDOWNS */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Entries by Branch */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <TitelMd>Entries by Branch</TitelMd>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search branch..." 
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                className="text-xs border border-gray-200 rounded-md pl-7 pr-2 py-1.5 focus:ring-1 focus:ring-primary outline-none w-48 shadow-sm"
              />
              <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            </div>
          </div>
          {isChartsLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <PharmacyCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {chartStats?.entriesByBranch
                ?.filter((branch: any) => branch.name.toLowerCase().includes(branchSearch.toLowerCase()))
                ?.slice(0, 10).map((branch: any) => (
                <DashbaordDetailCard
                  key={branch.name}
                  title={branch.name}
                  iconClassName="bg-primary/5"
                  icon={<Building2 className="size-4 text-primary" />}
                  data={[{ label: "Total Entries", value: branch.count }]}
                />
              ))}
              {(!chartStats?.entriesByBranch || chartStats.entriesByBranch.length === 0) && (
                <p className="text-sm text-gray-500">No branch data available.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {isChartsLoading ? (
            <ChartSkeleton height={300} />
          ) : (
            <DailyActivityChart 
              data={chartStats?.entriesByDay?.slice(0, 7).map((item: any) => ({
                displayDate: item.name,
                count: item.count
              })).reverse() || []}
              title="Recent Daily Entries"
              description="Entries over the filtered period"
            />
          )}
        </div>
      </div>
    </MainWrapper>
  );
};

export default AdminDashboard;
