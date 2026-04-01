import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/molecules/FieldError";
import FormLabel from "@/components/molecules/FormLabel";
import FormInput from "@/components/molecules/FormInput";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import { notify } from "@/components/ui/notify";
import { useNavigate } from "react-router-dom";

import {
  medicationDosageSchema,
  type MedicationDosageSchema,
} from "@/schema/medicationDosageSchema";

import { createMedicationDosage } from "@/api/medication-dosage.api";

const CreateMedicationDosage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

    // Helper to generate text
    const generateTitle = () => {
      const u = unit === 1 ? "Unit" : "Units";
      if (unitType === "DAY") return `${unit} ${u} ${value} times daily`;
      if (unitType === "WEEK") return `${unit} ${u} ${value} times per week`;
      if (unitType === "MONTH") return `${unit} ${u} ${value} times per month`;
      if (unitType === "EVERY_X_DAYS") return `${unit} ${u} every ${value} days`;
      return "";
    };

    const newTitle = generateTitle();

    if (!title) {
      setValue("title", newTitle);
    }
  }, [unit, value, unitType, setValue, title]);

  const onSubmit = async (values: MedicationDosageSchema) => {
    try {
      await createMedicationDosage(values);

      notify.success("Success", "Medication dosage created successfully");
      queryClient.invalidateQueries({ queryKey: ["medication-dosages"] });
      reset();
      navigate("/medication-dosages");
    } catch {
      notify.error("Failed", "Unable to create medication dosage");
    }
  };

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Dosages" path="/medication-dosages" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-0 rounded-xl p-6 space-y-6"
      >
        <FormLabelLg>Add Medication Dosage</FormLabelLg>

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
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/medication-dosages")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Dosage"}
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
};

export default CreateMedicationDosage;
