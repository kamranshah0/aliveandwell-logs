import { DataTable } from "@/components/table/DataTable";
import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDrugCategoriesList } from "@/hooks/useDrugCategoriesList";
import { deleteDrugCategory } from "@/api/drug-category.api";
import { notify } from "@/components/ui/notify";
import type { DrugCategoryData } from "./types";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useState } from "react";
 
export default function DrugCategoryDashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDrugCategoriesList();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteDrugCategory,
    onSuccess: () => {
      notify.success("Success", "Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["drug-categories"] });
      queryClient.invalidateQueries({ queryKey: ["drug-categories-list"] });
      setDeleteId(null);
    },
    onError: () => {
      notify.error("Failed", "Unable to delete category");
      setDeleteId(null);
    },
  });

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Drug Categories"
        description="Manage medication categories and therapeutic classes"
        actionContent={
          <Link to="/drug-categories/create">
            <Button className="flex items-center gap-2">
              <CirclePlus className="size-5" />
              Add Category
            </Button>
          </Link>
        }
      />
 
      {isError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Failed to load drug categories. Please try again later.
        </div>
      )}
 
      <DataTable<DrugCategoryData>
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
        title="Delete Drug Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </MainWrapper>
  );
}
