import { useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedicationDosages, deleteMedicationDosage } from "@/api/medication-dosage.api";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { notify } from "@/components/ui/notify";
import type { MedicationDosage } from "./types";
import { decryptText } from "@/utils/decryptAES";

export default function MedicationDosageDashboard() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["medication-dosages", "list"],
    queryFn: async () => {
      const res = await getMedicationDosages();
      const rawData = res.data.data;
      
      const decryptedData = await Promise.all(
        rawData.map(async (item: any) => ({
          ...item,
          title: item.title ? await decryptText(item.title) : item.title,
        }))
      );
      
      return decryptedData;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMedicationDosage(id),
    onSuccess: () => {
      notify.success("Success", "Dosage deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["medication-dosages"] });
      setDeleteId(null);
    },
    onError: () => {
      notify.error("Error", "Failed to delete dosage. It might be in use by medications.");
    },
  });

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Medication Dosages"
        description="Manage standard prescription dosage options"
        actionContent={
          <Link to="/medication-dosages/create">
            <Button>
              <CirclePlus className="size-5" /> Add Dosage
            </Button>
          </Link>
        }
      />

      {isError && (
        <div className="text-center py-10 text-text-danger-em">
          Failed to load medication dosages
        </div>
      )}

      <DataTable<MedicationDosage>
        columns={TableColumns(setDeleteId)}
        data={data ?? []}
        isLoading={isLoading}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Dosage"
        description="Are you sure you want to delete this dosage option? This action cannot be undone and may fail if it's currently assigned to medications."
        isLoading={deleteMutation.isPending}
      />
    </MainWrapper>
  );
}
