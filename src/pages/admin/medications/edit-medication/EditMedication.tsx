// src/pages/admin/medications/edit-medication/EditMedication.tsx
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/molecules/FieldError";
import FormLabel from "@/components/molecules/FormLabel";
import FormInput from "@/components/molecules/FormInput";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import FormSelect from "@/components/molecules/FormSelect";
import { notify } from "@/components/ui/notify";
import createPrescriptionSchema, {
  type CreatePrescriptionFormValues,
} from "@/schema/createPrescriptionSchema";
import { usePatients } from "@/hooks/usePatients";
import { useDoctors } from "@/hooks/useDoctors";
import { useMedicationDosages } from "@/hooks/useMedicationDosages";
import { usePharmacies } from "@/hooks/usePharmacies";
import { useMedicines } from "@/hooks/useMedicines";
import { getMedicationById, updateMedication } from "@/api/medication.api";
import { handleApiError } from "@/utils/handleApiError";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/skeletons/skeleton";
import { decryptText } from "@/utils/decryptAES";

const DURATION_OPTIONS = [
  { label: "7 days", value: "7" },
  { label: "14 days", value: "14" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
];

const CATEGORY_OPTIONS = [
  { label: "Prevention", value: "Prevention" },
  { label: "Primary Care", value: "Primary Care" },
];

const EditMedication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoadingMedication, setIsLoadingMedication] = useState(true);

  const { data: patientOptions = [], isLoading: patientsLoading } =
    usePatients();
  const { data: doctorOptions = [], isLoading: doctorsLoading } = useDoctors();
  const { data: dosageOptions = [], isLoading: dosagesLoading } =
    useMedicationDosages();
  const { data: pharmacyOptions = [], isLoading: pharmaciesLoading } =
    usePharmacies();
  const { data: medicineOptions = [], isLoading: medicinesLoading } =
    useMedicines();

  const methods = useForm<CreatePrescriptionFormValues>({
    resolver: zodResolver(
      createPrescriptionSchema,
    ) as unknown as Resolver<CreatePrescriptionFormValues>,
    mode: "onTouched",
    defaultValues: {
      patientId: "",
      medicationName: "",
      dosage: "",
      quantity: 1,
      refills: 0,
      rxDuration: "",
      prescriber: "",
      pharmacy: "",
      startDate: "",
      category: "",
      notes: "",
    },
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (!id) return;

    const fetchMedication = async () => {
      try {
        const response = await getMedicationById(id);
        const med = response.data.data;

        const decryptedNotes = await decryptText(med.notes);

        reset({
          patientId: med.patientId,
          medicationName: med.medicine?.id || "",
          dosage: med.dosage?.id || "",
          quantity: med.quantity,
          refills: med.refills,
          rxDuration: String(med.rxDurationDays),
          prescriber: med.prescriberId,
          pharmacy: med.pharmacy?.id || med.pharmacyId || "",
          startDate: med.createdAt?.split("T")[0] || "",
          category: med.category || "",
          notes: decryptedNotes,
        });
      } catch (error) {
        notify.error("Error", "Failed to fetch medication details");
        navigate("/medications");
      } finally {
        setIsLoadingMedication(false);
      }
    };

    fetchMedication();
  }, [id, reset, navigate]);

  const onSubmit = async (values: CreatePrescriptionFormValues) => {
    try {
      if (!id) return;

      const payload = {
        patientId: values.patientId,
        medicineId: values.medicationName,
        dosageId: values.dosage,
        prescriberId: values.prescriber,
        quantity: values.quantity,
        refills: values.refills,
        rxDurationDays: Number(values.rxDuration),
        status: "ACTIVE" as const,
        category: values.category,
        notes: values.notes,
        pharmacyId: values.pharmacy,
      };

      await updateMedication(id, payload);
      notify.success("Success", "Medication updated successfully");
      queryClient.invalidateQueries({ queryKey: ["useMedications"] });
      queryClient.invalidateQueries({ queryKey: ["medicationStats"] });
      queryClient.invalidateQueries({ queryKey: ["medication-view", id] });
      navigate("/medications");
    } catch (error) {
      handleApiError(error, methods.setError);
      notify.error("Failed", "Could not update medication");
    }
  };

  if (isLoadingMedication) {
    return (
      <MainWrapper className="flex flex-col gap-6">
        <SecondaryHeader title="Back to Medications" path="/medications" />
        <div className="bg-surface-0 rounded-xl p-6 space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-12 gap-6">
            <Skeleton className="col-span-4 h-12" />
            <Skeleton className="col-span-4 h-12" />
            <Skeleton className="col-span-4 h-12" />
            <Skeleton className="col-span-3 h-12" />
            <Skeleton className="col-span-3 h-12" />
            <Skeleton className="col-span-6 h-12" />
          </div>
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Medications" path="/medications" />

      <div className="bg-surface-0 rounded-xl drop-shadow-sm p-4 flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
          <div className="grid grid-cols-12 gap-6 px-6 py-4 pb-4">
            <div className="col-span-12">
              <FormLabelLg>Edit Information</FormLabelLg>
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12 md:col-span-4">
                  <FormLabel>Patient Name</FormLabel>
                  <Controller
                    name="patientId"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        placeholder="Select Patient"
                        options={patientOptions}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        loading={patientsLoading}
                        disabled
                      />
                    )}
                  />
                  <FieldError error={errors.patientId?.message as string} />
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FormLabel>Medication Name</FormLabel>
                  <Controller
                    name="medicationName"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        placeholder="Select Medication"
                        options={medicineOptions}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        loading={medicinesLoading}
                      />
                    )}
                  />
                  <FieldError
                    error={errors.medicationName?.message as string}
                  />
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FormLabel>Dosage</FormLabel>
                  <Controller
                    name="dosage"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        placeholder="Select Dosage"
                        options={dosageOptions}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        loading={dosagesLoading}
                      />
                    )}
                  />
                  <FieldError error={errors.dosage?.message as string} />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <FormLabel>Quantity</FormLabel>
                  <FormInput
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    placeholder="30"
                  />
                  <FieldError error={errors.quantity?.message as string} />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <FormLabel>Number of Refills</FormLabel>
                  <FormInput
                    type="number"
                    {...register("refills", { valueAsNumber: true })}
                    placeholder="0"
                  />
                  <FieldError error={errors.refills?.message as string} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 col-span-12">
              <FormLabelLg>RX Duration (Days)</FormLabelLg>
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12">
                  <Controller
                    name="rxDuration"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        options={DURATION_OPTIONS}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        placeholder="Select Duration"
                      />
                    )}
                  />
                  <FieldError error={errors.rxDuration?.message as string} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 col-span-12">
              <FormLabelLg>Prescriber</FormLabelLg>
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12">
                  <Controller
                    name="prescriber"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        options={doctorOptions}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        loading={doctorsLoading}
                      />
                    )}
                  />
                  <FieldError error={errors.prescriber?.message as string} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 col-span-12">
              <FormLabelLg>Pharmacy Assignment</FormLabelLg>
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12">
                  <Controller
                    name="pharmacy"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        options={pharmacyOptions}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        loading={pharmaciesLoading}
                      />
                    )}
                  />
                  <FieldError error={errors.pharmacy?.message as string} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 col-span-12">
              <FormLabelLg>Category</FormLabelLg>
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        options={CATEGORY_OPTIONS}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        placeholder="Select Category"
                      />
                    )}
                  />
                  <FieldError error={errors.category?.message as string} />
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <FormLabel>Notes</FormLabel>
              <textarea
                {...register("notes")}
                className="w-full rounded-md border p-3 min-h-[120px] bg-white text-sm"
                placeholder="Any additional instructions or notes"
              />
              <FieldError error={errors.notes?.message as string} />
            </div>
          </div>

          <div className="w-full bg-surface-0 border-t border-outline-low-em px-4 pt-4 flex justify-end gap-5">
            <Button
              variant="ghost"
              type="button"
              className="rounded-lg"
              onClick={() => navigate("/medications")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Prescription"}
            </Button>
          </div>
        </form>
      </div>
    </MainWrapper>
  );
};

export default EditMedication;
