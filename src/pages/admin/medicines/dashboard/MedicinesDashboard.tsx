import { useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMedicines, deleteMedicine } from "@/api/medicine.api";
import { mapMedicines } from "@/utils/mapMedicines";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { notify } from "@/components/ui/notify";

export default function MedicinesDashboard() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await fetchMedicines();
      return mapMedicines(res.data.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMedicine(id),
    onSuccess: () => {
      notify.success("Success", "Medicine deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      setDeleteId(null);
    },
    onError: () => {
      notify.error("Error", "Failed to delete medicine");
    },
  });

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Medicines"
        description="Track medicines and manage inventory"
        actionContent={
          <Link to="/medicines/create">
            <Button>
              <CirclePlus className="size-5" /> Add Medicine
            </Button>
          </Link>
        }
      />

      {/* ERROR */}
      {isError && (
        <div className="text-center py-10 text-text-danger-em">
          Failed to load medicines
        </div>
      )}

      <DataTable
        columns={TableColumns(setDeleteId)}
        data={data ?? []}
        filters={DataFilters}
        isLoading={isLoading}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Medicine"
        description="Are you sure you want to delete this medicine? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </MainWrapper>
  );
}
