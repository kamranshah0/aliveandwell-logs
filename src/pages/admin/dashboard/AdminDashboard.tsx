import React, { useState } from "react";
import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import DashbaordCard from "@/components/molecules/DashbaordCard";
import { ClipboardList, UsersRound, Building2, UserPlus, HeartPulse, FilterX, Calendar } from "lucide-react";
import TitelMd from "@/components/molecules/TiteMd";
import DashbaordDetailCard from "@/components/molecules/DashbaordDetailCard";
import { useQuery } from "@tanstack/react-query";
import { getAdminDailyLogReports, getDailyLogFields } from "@/api/daily-log.api";
import { getPharmacies } from "@/api/pharmacy.api";
import DashboardStatsCardSkeleton from "@/components/skeletons/DashboardStatsCardSkeleton";
import PharmacyCardSkeleton from "@/components/skeletons/PharmacyCardSkeleton";
import DailyActivityChart from "./DailyActivityChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth } from "date-fns";

const AdminDashboard = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("all");

  const { data: adminStats, isLoading, isFetching } = useQuery({
    queryKey: ["adminDailyLogReports", startDate, endDate, branchId],
    queryFn: async () => {
      const res = await getAdminDailyLogReports({
        startDate,
        endDate,
        branchId: branchId === "all" ? undefined : branchId,
      });
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: pharmaciesRes } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: getPharmacies,
  });

  const { data: fieldsRes } = useQuery({
    queryKey: ["dailyLogFields"],
    queryFn: getDailyLogFields,
  });

  const pharmacies = pharmaciesRes?.data?.data || [];
  const fields = fieldsRes?.data?.data || [];
  
  const [activeBranchesList, setActiveBranchesList] = useState<string[]>([]);

  React.useEffect(() => {
    if (branchId === "all" && adminStats?.entriesByBranch) {
      const names = adminStats.entriesByBranch.map((b: any) => b.name);
      if (names.length > 0) setActiveBranchesList(names);
    }
  }, [adminStats?.entriesByBranch, branchId]);

  const filteredPharmacies = pharmacies.filter((p: any) => 
    activeBranchesList.includes(p.name) || p.id === branchId
  );

  const [branchSearch, setBranchSearch] = useState("");

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setBranchId("all");
    setBranchSearch("");
  };

  return (
    <MainWrapper className="flex flex-col gap-8">
      <MainHeader
        title="Admin Dashboard"
        description="Comprehensive overview of all log entries across the organization."
        actionContent={
          <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
            {/* Date Filters */}
            <div className="flex items-center gap-1 bg-white border rounded px-2 py-1 shadow-sm">
              <Calendar className="size-3.5 text-gray-400" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs border-none focus:ring-0 outline-none p-0 cursor-pointer"
              />
              <span className="text-gray-300 mx-1">/</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs border-none focus:ring-0 outline-none p-0 cursor-pointer"
              />
            </div>

            {/* Location (Branch) Search Select */}
            <div className="w-[200px]">
              <SearchSelect 
                placeholder="All Active Locations"
                value={branchId}
                onChange={setBranchId}
                options={[
                  { label: "All Active Locations", value: "all" },
                  ...(activeBranchesList.map((name: string) => ({
                    label: name,
                    value: name
                  })))
                ]}
              />
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters}
              className="h-8 text-gray-400 hover:text-red-500"
            >
              <FilterX className="size-3.5" />
            </Button>
          </div>
        }
      />

      {/* TOP METRICS */}
      <div className="space-y-4">
        {(isLoading || isFetching) ? (
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
        {(isLoading || isFetching) ? (
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
          {(isLoading || isFetching) ? (
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
          {(isLoading || isFetching) ? (
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
