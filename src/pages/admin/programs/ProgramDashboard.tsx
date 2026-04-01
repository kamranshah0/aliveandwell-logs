"use client";

import { useQuery } from "@tanstack/react-query";
import MainWrapper from "@/components/molecules/MainWrapper";
import MainHeader from "@/components/molecules/MainHeader";
import DashbaordCard from "@/components/molecules/DashbaordCard";
import DashboardStatsCardSkeleton from "@/components/skeletons/DashboardStatsCardSkeleton";

import { FileText, HandHeart, TrendingUp, UsersRound } from "lucide-react";
import { RiCapsuleLine } from "react-icons/ri";

import ProgramsPieChart from "./ProgramsPieChart";
import { getAllPrograms } from "@/api/programs.api";
import { EnrollPatientModal } from "@/components/modals/EnrollPatientModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/* ---------------- Types ---------------- */
export interface ProgramApiItem {
  id: string;
  name: string;
  target: number;
  currentEnrolled: number;
}

const ProgramDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allProgramStats"],
    queryFn: async () => {
      const res = await getAllPrograms();
      return (res.data.data as ProgramApiItem[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const programs = data ?? [];

  const totalPatients = programs.reduce((sum, p) => sum + p.currentEnrolled, 0);

  const [openEnroll, setOpenEnroll] = useState(false);

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Programs Dashboard"
        description="Program insights and patient enrollment overview"
        actionContent={
          <Button onClick={() => setOpenEnroll(true)}>
            <HandHeart className="size-5" />
            Enroll Patient to Program
          </Button>
        }
      />

      {/* ================= STATS ================= */}
      {isLoading ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <DashboardStatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {/* Total */}
          <DashbaordCard
            title="All Users"
            value={totalPatients}
            icon={<UsersRound className="size-5 text-primary" />}
            target={programs.reduce((s, p) => s + p.target, 0)}
            currentValue={totalPatients}
          />

          {/* Per Program */}
          {programs.map((program) => (
            <DashbaordCard
              key={program.id}
              title={program.name}
              value={program.currentEnrolled}
              icon={<UsersRound className="size-5 text-primary" />}
              target={program.target}
              currentValue={program.currentEnrolled}
            />
          ))}
        </div>
      )}

      {/* ================= PIE CHART ================= */}
      <ProgramsPieChart data={programs} isLoading={isLoading} />
      <EnrollPatientModal
        open={openEnroll}
        onClose={() => setOpenEnroll(false)}
      />
    </MainWrapper>
  );
};

export default ProgramDashboard;
