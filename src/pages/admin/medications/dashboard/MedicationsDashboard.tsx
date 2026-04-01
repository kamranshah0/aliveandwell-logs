import { useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import type { DataTypes } from "./types";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { CirclePlus, Clock, Hourglass } from "lucide-react";
import { notify } from "@/components/ui/notify";
import DashbaordCard from "@/components/molecules/DashbaordCard";
import { RiCapsuleLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useMedications } from "@/hooks/useMedications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedicationsStats, deleteMedication } from "@/api/medication.api";
import DashboardStatsCardSkeleton from "@/components/skeletons/DashboardStatsCardSkeleton";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

export default function MedicationsDashboard() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: medications = [], isLoading, isError } = useMedications();
  const {
    data: medicationStats,
    isLoading: isMedicationStatsLoading,
    // isError,
    // refetch,
  } = useQuery({
    queryKey: ["medicationStats"],
    queryFn: async () => {
      const res = await getMedicationsStats();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    notify.error("Failed", "Unable to load medications");
  }

  const deleteMutation = useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => {
      notify.success("Medication deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["useMedications"] });
      queryClient.invalidateQueries({ queryKey: ["medicationStats"] });
      setDeleteId(null);
    },
    onError: () => {
      notify.error("Failed", "Unable to delete medication");
    },
  });

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Medications"
        description="Track prescriptions, refills, and medication schedules"
        actionContent={
          <Link to="/medication/create/percription">
            <Button>
              <CirclePlus className="size-5" /> New Perscription
            </Button>
          </Link>
        }
      />

      {isMedicationStatsLoading ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardStatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2  gap-6">
          <DashbaordCard
            title="Active Medications"
            value={medicationStats.activeMedications}
          />
          <DashbaordCard
            title="Refill Needed"
            value={medicationStats.refillsNeeded}
            iconClassName="bg-yellow/10"
            icon={<RiCapsuleLine className="size-4 text-yellow" />}
          />
          <DashbaordCard
            title="Due This Week"
            value={medicationStats.dueThisWeek}
            iconClassName="bg-primary/10"
            icon={<Clock className="size-4 text-text-primary" />}
          />
          <DashbaordCard
            title="Pending Approval"
            value={medicationStats.pendingApproval}
            iconClassName="bg-secondary/10"
            icon={<Hourglass className="size-4 text-text-secondary" />}
          />
        </div>
      )}

      <DataTable<DataTypes>
        columns={TableColumns}
        data={medications}
        filters={DataFilters}
        isLoading={isLoading}
        onDelete={(id) => setDeleteId(String(id))}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Medication"
        description="Are you sure you want to delete this medication? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </MainWrapper>
  );
}
