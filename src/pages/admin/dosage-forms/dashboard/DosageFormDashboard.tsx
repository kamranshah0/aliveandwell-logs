import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDosageFormsList } from "@/hooks/useDosageFormsList";
import { deleteDosageForm } from "@/api/dosage-form.api";
import { notify } from "@/components/ui/notify";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import type { DosageFormData } from "./types";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useState } from "react";

export default function DosageFormDashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDosageFormsList();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteDosageForm,
    onSuccess: () => {
      notify.success("Success", "Dosage form deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["dosage-forms"] });
      queryClient.invalidateQueries({ queryKey: ["dosage-forms-list"] });
      setDeleteId(null);
    },
    onError: () => {
      notify.error("Failed", "Unable to delete dosage form");
      setDeleteId(null);
    },
  });

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Dosage Forms"
        description="Manage medication dosage forms and formulations"
        actionContent={
          <Link to="/dosage-forms/create">
            <Button className="flex items-center gap-2">
              <CirclePlus className="size-5" />
              Add Dosage Form
            </Button>
          </Link>
        }
      />

      {isError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Failed to load dosage forms. Please try again later.
        </div>
      )}

      <DataTable<DosageFormData>
        columns={TableColumns}
        data={data ?? []}
        filters={DataFilters}
        isLoading={isLoading}
        onDelete={(id) => setDeleteId(String(id))}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Dosage Form"
        description="Are you sure you want to delete this dosage form? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </MainWrapper>
  );
}
