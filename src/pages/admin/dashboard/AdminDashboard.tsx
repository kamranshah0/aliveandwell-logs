import { useState } from "react";
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
  const { data: configRes, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["dashboardConfig"],
    queryFn: getDashboardConfig,
  });

  const globalConfig = configRes?.data || {};

  const { data: adminStats, isLoading, isFetching } = useQuery({
    queryKey: ["adminDailyLogReports", globalConfig.startDate, globalConfig.endDate, globalConfig.location, globalConfig.showLast24Hours],
    queryFn: async () => {
      const resolvedEndDate = globalConfig.endDate === "today" 
        ? format(new Date(), "yyyy-MM-dd") 
        : (globalConfig.endDate || "");

      const res = await getAdminDailyLogReports({
        startDate: globalConfig.startDate || "",
        endDate: resolvedEndDate,
        branchId: globalConfig.location === "all" ? undefined : globalConfig.location,
        showLast24Hours: globalConfig.showLast24Hours,
      });
      return res.data.data;
    },
    enabled: !!configRes,
    staleTime: 5 * 60 * 1000,
  });

  const visibleCards = {
    ...defaultVisibleCards,
    ...(globalConfig.visibleCards || {}),
  };
  
  const [branchSearch, setBranchSearch] = useState("");

  const isLoadingTotal = isLoading || isFetching || isLoadingConfig;
  const totalEntries = adminStats?.entriesByDay?.reduce((sum: number, day: any) => sum + day.count, 0) || 0;
  const newPatients = adminStats?.newPatients || 0;
  const rawLogs = adminStats?.rawLogs || [];
  const countByFieldValue = (fieldName: string, targetValue: string) =>
    rawLogs.filter((log: any) => {
      const value = log[fieldName] ?? log.additionalData?.[fieldName];
      return String(value || "").trim().toLowerCase() === targetValue.toLowerCase();
    }).length;

  const baseMetricCards = [
    {
      key: "entriesThisMonth",
      title: "Entries This Month",
      value: adminStats?.currentMonthEntries || 0,
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

  return (
    <MainWrapper className="flex flex-col gap-8">
      <MainHeader
        title="Admin Dashboard"
        description="Comprehensive overview of all log entries across the organization."
      />

      {/* TOP METRICS */}
      <div className="space-y-4">
        {isLoadingTotal ? (
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
        {isLoadingTotal ? (
          <div className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
        ) : (
          <DailyActivityChart 
            data={adminStats?.entriesByMonth?.map((item: any) => ({
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
          {isLoadingTotal ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <PharmacyCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {adminStats?.entriesByBranch
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
              {(!adminStats?.entriesByBranch || adminStats.entriesByBranch.length === 0) && (
                <p className="text-sm text-gray-500">No branch data available.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {isLoadingTotal ? (
            <div className="h-[250px] bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <DailyActivityChart 
              data={adminStats?.entriesByDay?.slice(0, 7).map((item: any) => ({
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
