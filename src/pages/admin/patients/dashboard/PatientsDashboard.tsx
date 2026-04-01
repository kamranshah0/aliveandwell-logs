"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import { notify } from "@/components/ui/notify";

import { HandHeart, Upload, UserPlus2 } from "lucide-react";

import { TableColumns } from "./columns";
import { DataFilters } from "./filters";
import type { DataTypes } from "./types";

import {
  fetchPatients,
  deletePatient,
  bulkDeletePatients,
} from "@/api/patient.api";
import { mapPatients } from "@/utils/mapPatients";

import { EnrollPatientModal } from "@/components/modals/EnrollPatientModal";
import UploadPatientsExcelModal from "@/components/modals/uploadPatientsExcelModal";
import DisenrollProgramModal from "@/components/modals/DisenrollProgramModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

export default function PatientsDashboard() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);

  /* =========================
      FETCH PATIENTS
     ========================= */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetchPatients();
      return mapPatients(res.data.data);
    },
  });

  /* =========================
      OPTIMISTIC DELETE
     ========================= */
  const deleteMutation = useMutation({
    mutationFn: deletePatient,

    onMutate: async (cognitoId: string) => {
      await queryClient.cancelQueries({ queryKey: ["patients"] });

      const previousPatients = queryClient.getQueryData<DataTypes[]>([
        "patients",
      ]);

      // 🚀 INSTANT UI UPDATE
      queryClient.setQueryData<DataTypes[]>(["patients"], (old) =>
        old?.filter((p) => p.id !== cognitoId),
      );

      return { previousPatients };
    },

    onError: (_err, _id, context) => {
      if (context?.previousPatients) {
        queryClient.setQueryData(["patients"], context.previousPatients);
      }
      notify.error("Failed to delete patient");
      setDeleteId(null);
    },

    onSuccess: () => {
      notify.success("Patient deleted successfully");
      setDeleteId(null);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  /* =========================
      BULK DELETE
     ========================= */
  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeletePatients,
    onMutate: async (cognitoIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ["patients"] });

      const previousPatients = queryClient.getQueryData<DataTypes[]>([
        "patients",
      ]);

      // 🚀 INSTANT UI UPDATE (Optimistic)
      queryClient.setQueryData<DataTypes[]>(["patients"], (old) =>
        old?.filter((p) => !cognitoIds.includes(p.id)),
      );

      return { previousPatients };
    },
    onSuccess: (res: any) => {
      if (res?.success) {
        notify.success("Patients deleted successfully");
      } else {
        notify.warning(
          `Some deletions failed. ${res?.data?.failedCount} records skipped.`,
        );
      }
      setBulkDeleteIds(null);
    },
    onError: (_err, _ids, context) => {
      if (context?.previousPatients) {
        queryClient.setQueryData(["patients"], context.previousPatients);
      }
      notify.error("Failed to perform bulk delete");
      setBulkDeleteIds(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  /* =========================
      MODAL STATES
     ========================= */
  const [openEnroll, setOpenEnroll] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<DataTypes | null>(
    null,
  );

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Patients"
        description="Manage patient records and medication profiles"
        actionContent={
          <div className="flex gap-2 max-sm:flex-col">
            <Button variant="outline" onClick={() => setUploadOpen(true)}>
              <Upload className="size-5" />
              Upload Patients
            </Button>

            <Button variant="outline" onClick={() => setOpenEnroll(true)}>
              <HandHeart className="size-5" />
              Enroll Patient
            </Button>

            <Link to="/patient/create">
              <Button>
                <UserPlus2 className="size-5" /> Add Patient
              </Button>
            </Link>
          </div>
        }
      />

      {isError && (
        <div className="text-center py-10 text-text-danger-em">
          Failed to load patients
        </div>
      )}

      <DataTable<DataTypes>
        columns={TableColumns}
        data={data ?? []}
        filters={DataFilters}
        isLoading={isLoading}
        isBulkDeleting={bulkDeleteMutation.isPending}
        onDelete={(id) => setDeleteId(String(id))}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
        meta={{
          openDisenroll: (patient: DataTypes) => {
            setSelectedPatient(patient);
          },
        }}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Patient"
        description="Are you sure you want to delete this patient? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />

      <DeleteConfirmModal
        open={!!bulkDeleteIds}
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={() => bulkDeleteIds && bulkDeleteMutation.mutate(bulkDeleteIds)}
        title="Bulk Delete Patients"
        description={`Are you sure you want to delete ${bulkDeleteIds?.length} patients? This action cannot be undone.`}
        isLoading={bulkDeleteMutation.isPending}
      />

      {/* DISENROLL MODAL */}
      {selectedPatient && (
        <DisenrollProgramModal
          open={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          programs={
            Array.isArray(selectedPatient.programs)
              ? selectedPatient.programs
              : []
          }
        />
      )}

      {/* ENROLL MODAL */}
      <EnrollPatientModal
        open={openEnroll}
        onClose={() => setOpenEnroll(false)}
      />

      {/* UPLOAD MODAL */}
      <UploadPatientsExcelModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </MainWrapper>
  );
}
