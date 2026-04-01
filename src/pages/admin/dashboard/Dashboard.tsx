import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import DashbaordCard from "@/components/molecules/DashbaordCard";
import { Box, UsersRound } from "lucide-react";
import { RiCapsuleLine } from "react-icons/ri";

import TitelMd from "@/components/molecules/TiteMd";
import DashbaordDetailCard from "@/components/molecules/DashbaordDetailCard";
import FinancialInsightsChart from "./FinancialInsightsChart";
import PharmacyCardSkeleton from "@/components/skeletons/PharmacyCardSkeleton";
import EmptyState from "@/components/empty/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { getPharmacies } from "@/api/pharmacy.api";
import { getDashboardRefillActivity, getDashboardStats } from "@/api/dashboard.api";
import { Link } from "react-router-dom";
import DashboardStatsCardSkeleton from "@/components/skeletons/DashboardStatsCardSkeleton";

const Dashboard = () => {
  const {
    data: pharmacyData,
    isLoading: isPharmacyLoading,
    // isError,
    // refetch,
  } = useQuery({
    queryKey: ["dashboardPharmacies"],
    queryFn: async () => {
      const res = await getPharmacies();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  const {
    data: dashboardStats,
    isLoading: isDashboardStatsLoading,
    // isError,
    // refetch,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await getDashboardStats();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

 
  const {
    data: dashboardRefillActivity,
    // isLoading: isDashboardRefillActivityLoading,
    // isError,
    // refetch,
  } = useQuery({
    queryKey: ["dashboardRefillActivity"],
    queryFn: async () => {
      const res = await getDashboardRefillActivity();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });



  const chartData =
  dashboardRefillActivity?.weeklyData?.map((week: any) => ({
    name: week.weekRange,
    actual: week.totalRequests,
    expected: week.approvedThisWeek,
  })) ?? [];


  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Dashboard"
        description="Overview of your medication management system"
      />
 
      {isDashboardStatsLoading ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardStatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          <DashbaordCard
            title="Total Patients"
            value={dashboardStats.patientsCount}
            iconClassName="bg-primary/10"
            icon={<UsersRound className="size-4 text-primary" />}
          />
          <DashbaordCard
            title="Refill Needed"
            value={dashboardStats.refillNeededCount}
            iconClassName="bg-yellow/10"
            icon={<RiCapsuleLine className="size-4 text-yellow" />}
          />
          <DashbaordCard
            title="Pick Up Pending"
            value={dashboardStats.pickUpPendingCount}
            iconClassName="bg-primary/10"
            icon={<Box className="size-4 text-text-primary" />}
          />
          <DashbaordCard
            title="Completed This Month"
            value={dashboardStats.completedThisMonthCount}
            iconClassName="bg-secondary/10"
            icon={<Box className="size-4 text-text-secondary" />}
          />
        </div>
      )}

      
   

      <div>
        <FinancialInsightsChart data={chartData} />
      </div>

      <div className="flex flex-col gap-4">
        <TitelMd>Pharmacy Summary</TitelMd>
      
        {isPharmacyLoading ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-2  gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <PharmacyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-2  gap-6">
            {pharmacyData.map((pharmacy: any) => (
              <Link key={pharmacy.id} to={`/pharmacy/${pharmacy.id}`}>
                <DashbaordDetailCard
                  title={pharmacy.name}
                  iconClassName="bg-primary/10"
                  icon={<RiCapsuleLine className="size-4 text-text-primary" />}
                  data={[
                    {
                      label: "Patients",
                      value: pharmacy.statistics?.patientsCount ?? 0,
                    },
                    {
                      label: "Refills This Month",
                      value: pharmacy.statistics?.refillsThisMonth ?? 0,
                    },
                    {
                      label: "Pickup Pending",
                      value: pharmacy.statistics?.pickupPending ?? 0,
                    },
                  ]}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainWrapper>
  );
};

export default Dashboard;
