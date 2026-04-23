import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import DashbaordCard from "@/components/molecules/DashbaordCard";
import { ClipboardList, UsersRound, Building2, UserPlus, HeartPulse } from "lucide-react";
import TitelMd from "@/components/molecules/TiteMd";
import DashbaordDetailCard from "@/components/molecules/DashbaordDetailCard";
import { useQuery } from "@tanstack/react-query";
import { getAdminDailyLogReports } from "@/api/daily-log.api";
import DashboardStatsCardSkeleton from "@/components/skeletons/DashboardStatsCardSkeleton";
import PharmacyCardSkeleton from "@/components/skeletons/PharmacyCardSkeleton";
import DailyActivityChart from "./DailyActivityChart"; // Reuse chart for monthly trend

const AdminDashboard = () => {
  const { data: adminStats, isLoading } = useQuery({
    queryKey: ["adminDailyLogReports"],
    queryFn: async () => {
      const res = await getAdminDailyLogReports();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <MainWrapper className="flex flex-col gap-8">
      <MainHeader
        title="Admin Dashboard"
        description="Comprehensive overview of all log entries across the organization."
      />

      {/* TOP METRICS */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <DashboardStatsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            <DashbaordCard
              title="Entries This Month"
              value={adminStats?.currentMonthEntries || 0}
              iconClassName="bg-primary/10"
              icon={<ClipboardList className="size-5 text-primary" />}
            />
            <DashbaordCard
              title="Total Entries"
              value={adminStats?.entriesByDay?.reduce((sum: number, day: any) => sum + day.count, 0) || 0}
              iconClassName="bg-green-50"
              icon={<UsersRound className="size-5 text-green-600" />}
            />
            <DashbaordCard
              title="New Patients"
              value={adminStats?.newPatients || 0}
              iconClassName="bg-secondary/10"
              icon={<UserPlus className="size-5 text-secondary" />}
            />
            <DashbaordCard
              title="Enrolled Patients"
              value={adminStats?.enrolledPatients || 0}
              iconClassName="bg-blue-50"
              icon={<HeartPulse className="size-5 text-blue-600" />}
            />
          </div>
        )}
      </div>

      {/* MONTHLY TREND CHART */}
      <div className="grid grid-cols-1">
        {isLoading ? (
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
          <TitelMd>Entries by Branch</TitelMd>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <PharmacyCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {adminStats?.entriesByBranch?.slice(0, 6).map((branch: any) => (
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

        {/* Entries by Day (Recent) */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="h-[250px] bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <DailyActivityChart 
              data={adminStats?.entriesByDay?.slice(0, 7).map((item: any) => ({
                displayDate: item.name,
                count: item.count
              })).reverse() || []}
              title="Recent Daily Entries"
              description="Entries over the last 7 active days"
            />
          )}
        </div>

      </div>
    </MainWrapper>
  );
};

export default AdminDashboard;
