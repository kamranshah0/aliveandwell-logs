import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import DashbaordCard from "@/components/molecules/DashbaordCard";
import { ClipboardList, UserCheck } from "lucide-react";

import TitelMd from "@/components/molecules/TiteMd";
import DashbaordDetailCard from "@/components/molecules/DashbaordDetailCard";
import DailyActivityChart from "./DailyActivityChart";
import { useQuery } from "@tanstack/react-query";
import { getDailyLogStats } from "@/api/daily-log.api";
import DashboardStatsCardSkeleton from "@/components/skeletons/DashboardStatsCardSkeleton";
import PharmacyCardSkeleton from "@/components/skeletons/PharmacyCardSkeleton";

const Dashboard = () => {
  const { data: dailyLogStats, isLoading: isDailyLogStatsLoading } = useQuery({
    queryKey: ["dailyLogStats"],
    queryFn: async () => {
      const res = await getDailyLogStats();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <MainWrapper className="flex flex-col gap-8">
      <MainHeader
        title="Receptionist Dashboard"
        description="Your personalized overview of daily patient logs and activity."
      />

      {/* PERSONAL STATS CARDS */}
      <div className="space-y-4">
       
        {isDailyLogStatsLoading ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <DashboardStatsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-6">
            <DashbaordCard
              title="My Total Entries"
              value={dailyLogStats?.totalEntries}
              iconClassName="bg-primary/10"
              icon={<ClipboardList className="size-4 text-primary" />}
            />
            <DashbaordCard
              title="My Entries Today"
              value={dailyLogStats?.entriesToday}
              iconClassName="bg-green-50"
              icon={<UserCheck className="size-4 text-green-600" />}
            />
          </div>
        )}
      </div>

      {/* ACTIVITY CHART */}
      <div className="grid grid-cols-1">
        <DailyActivityChart data={dailyLogStats?.dailyTrends ?? []} />
      </div>

      {/* PERFORMANCE BREAKDOWN */}
      <div className="flex flex-col gap-4">
         <TitelMd>My Performance Breakdown</TitelMd>
         {isDailyLogStatsLoading ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
               {Array.from({ length: 4 }).map((_, i) => <PharmacyCardSkeleton key={i} />)}
            </div>
         ) : (
           <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
              {dailyLogStats?.representativeStats?.map((rep: any) => (
                <DashbaordDetailCard
                  key={rep.name}
                  title={rep.name}
                  iconClassName="bg-primary/5"
                  icon={<UserCheck className="size-4 text-primary" />}
                  data={[
                    {
                      label: "Total Entries Submitted",
                      value: rep.count,
                    }
                  ]}
                />
              ))}
           </div>
         )}
      </div>
    </MainWrapper>
  );
};

export default Dashboard;
