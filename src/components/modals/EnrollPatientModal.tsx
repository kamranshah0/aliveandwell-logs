// src/components/EnrollPatientModal.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormSelect from "@/components/molecules/FormSelect";
import { notify } from "@/components/ui/notify";

import { fetchPatients } from "@/api/patient.api";
import { getAllPrograms, enrollPatientProgram } from "@/api/programs.api";
import FormLabel from "../molecules/FormLabel";
import { HandHeart } from "lucide-react";

export const EnrollPatientModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const qc = useQueryClient();

  const [patientId, setPatientId] = useState<string>();
  const [programId, setProgramId] = useState<string>();

  /* FETCH PATIENTS */
  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["enrollPatients"],
    queryFn: async () => {
      const res = await fetchPatients();
      return res.data.data;
    },
  });

  /* FETCH PROGRAMS */
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ["enrollPrograms"],
    queryFn: async () => {
      const res = await getAllPrograms();
      return res.data.data;
    },
  });

  /* ENROLL */
  const enrollMutation = useMutation({
    mutationFn: enrollPatientProgram,
    onSuccess: () => {
      notify.success("Patient enrolled successfully", "", 1000);
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["allProgramStats"] });
      onClose();
      setPatientId(undefined);
      setProgramId(undefined);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to enroll patient";
      notify.error(message);
    },
  });

  const handleEnroll = () => {
    if (!patientId || !programId) {
      notify.error("Please select patient and program");
      return;
    }

    enrollMutation.mutate({ patientId, programId });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex gap-2 items-center">
          <HandHeart className="size-6 text-text-primary" />
          <DialogTitle>Enroll Patient to Program</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* PATIENT SELECT */}
          <div>
            <FormLabel> Patient</FormLabel>
            <FormSelect
              placeholder="Select Patient"
              loading={patientsLoading}
              value={patientId}
              onChange={setPatientId}
              options={patients.map((p: any) => ({
                value: p.id,
                label: `${p.name} (${p.patientid})`,
              }))}
            />
          </div>

          <div>
            {/* PROGRAM SELECT */}
            <FormLabel> Program</FormLabel>
            <FormSelect
              placeholder="Select Program"
              loading={programsLoading}
              value={programId}
              onChange={setProgramId}
              options={programs.map((p: any) => ({
                value: p.id,
                label: p.name,
              }))}
            />
          </div>
          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              // loading={enrollMutation.isPending}
              onClick={handleEnroll}
            >
              {enrollMutation.isPending ? (
                <>
                  Enrolling
                  <svg
                    className="animate-spin size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </>
              ) : (
                <> Enroll Patient</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
