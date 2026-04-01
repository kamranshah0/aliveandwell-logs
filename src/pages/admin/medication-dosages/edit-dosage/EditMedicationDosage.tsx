import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/molecules/FieldError";
import FormLabel from "@/components/molecules/FormLabel";
import FormInput from "@/components/molecules/FormInput";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import { notify } from "@/components/ui/notify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import {
  medicationDosageSchema,
  type MedicationDosageSchema,
} from "@/schema/medicationDosageSchema";

import { getMedicationDosageById, updateMedicationDosage } from "@/api/medication-dosage.api";
import { decryptText } from "@/utils/decryptAES";

const EditMedicationDosage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dosage, isLoading: isFetching } = useQuery({
    queryKey: ["medication-dosage", id],
    queryFn: async () => {
      const res = await getMedicationDosageById(id!);
      const data = res.data.data;
      if (data.title) {
        data.title = await decryptText(data.title);
      }
      return data;
    },
    enabled: !!id,
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<MedicationDosageSchema>({
    resolver: zodResolver(medicationDosageSchema),
    defaultValues: {
      status: "ACTIVE",
      unit: 1,
      unitType: "DAY",
    },
  });

  const [unit, value, unitType, title] = watch(["unit", "value", "unitType", "title"]);

  useEffect(() => {
    if (!unit || !value || !unitType) return;

    const generateTitle = () => {
      const u = unit === 1 ? "Unit" : "Units";
      if (unitType === "DAY") return `${unit} ${u} ${value} times daily`;
      if (unitType === "WEEK") return `${unit} ${u} ${value} times per week`;
      if (unitType === "MONTH") return `${unit} ${u} ${value} times per month`;
      if (unitType === "EVERY_X_DAYS") return `${unit} ${u} every ${value} days`;
      return "";
    };

    const newTitle = generateTitle();

    // In Edit, we only auto-update if the title is empty
    if (!title) {
      setValue("title", newTitle);
    }
  }, [unit, value, unitType, setValue, title]);

  useEffect(() => {
    if (dosage) {
      reset({
        title: dosage.title,
        unit: dosage.unit,
        value: dosage.value,
        unitType: dosage.unitType,
        status: dosage.status,
      });
    }
  }, [dosage, reset]);

  const updateMutation = useMutation({
    mutationFn: (values: MedicationDosageSchema) => updateMedicationDosage(id!, values),
    onSuccess: () => {
      notify.success("Success", "Medication dosage updated successfully");
      queryClient.invalidateQueries({ queryKey: ["medication-dosages"] });
      navigate("/medication-dosages");
    },
    onError: () => {
      notify.error("Failed", "Unable to update medication dosage");
    },
  });

  const onSubmit = (values: MedicationDosageSchema) => {
    updateMutation.mutate(values);
  };

  if (isFetching) {
    return (
      <MainWrapper>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading dosage details...</p>
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Dosages" path="/medication-dosages" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-0 rounded-xl p-6 space-y-6"
      >
        <FormLabelLg>Edit Medication Dosage</FormLabelLg>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <FormLabel>Title</FormLabel>
            <FormInput
              {...register("title")}
              placeholder="e.g. 1 Tablet Daily"
            />
            <FieldError error={errors.title?.message} />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormLabel>Unit (e.g. 1 Tablet)</FormLabel>
            <FormInput
              type="number"
              {...register("unit", { valueAsNumber: true })}
              placeholder="Enter unit quantity"
            />
            <FieldError error={errors.unit?.message} />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormLabel>Value (Frequency value)</FormLabel>
            <FormInput
              type="number"
              {...register("value", { valueAsNumber: true })}
              placeholder="e.g. 1 for daily, 3 for every 3 days"
            />
            <FieldError error={errors.value?.message} />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormLabel>Frequency Type</FormLabel>
            <select
              {...register("unitType")}
              className="w-full border border-outline-high-em rounded-md p-2.5 bg-white focus:outline-primary transition-all text-sm font-medium"
            >
              <option value="DAY">Daily (Times per day)</option>
              <option value="WEEK">Weekly</option>
              <option value="MONTH">Monthly</option>
              <option value="EVERY_X_DAYS">Every X Days</option>
            </select>
            <FieldError error={errors.unitType?.message} />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormLabel>Status</FormLabel>
            <select
              {...register("status")}
              className="w-full border border-outline-high-em rounded-md p-2.5 bg-white focus:outline-primary transition-all text-sm font-medium"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <FieldError error={errors.status?.message} />
          </div>

          {dosage?.dailyDose !== undefined && (
            <div className="col-span-12 md:col-span-6">
              <FormLabel>Daily Dose (Calculated)</FormLabel>
              <div className="w-full border border-outline-low-em rounded-md p-2.5 bg-surface-1 text-sm font-semibold text-primary-em">
                {dosage.dailyDose}
              </div>
              <p className="text-[10px] text-text-low-em mt-1">
                Auto-calculated based on unit, value, and frequency.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/medication-dosages")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
            {isSubmitting || updateMutation.isPending ? "Saving..." : "Update Dosage"}
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
};

export default EditMedicationDosage;
