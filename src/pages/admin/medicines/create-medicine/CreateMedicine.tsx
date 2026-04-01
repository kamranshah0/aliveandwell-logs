import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/molecules/FieldError";
import FormLabel from "@/components/molecules/FormLabel";
import FormInput from "@/components/molecules/FormInput";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import FormSelect from "@/components/molecules/FormSelect";
import { notify } from "@/components/ui/notify";
import { useNavigate } from "react-router-dom";

import createMedicineSchema, {
  type CreateMedicineFormValues,
} from "@/schema/createMedicineSchema";

import { useDrugCategories } from "@/hooks/useDrugCategories";
import { useDosageForms } from "@/hooks/useDosageForms";
import { usePharmacies } from "@/hooks/usePharmacies";
import { createMedicine } from "@/api/medicine.api";

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const CreateMedicine = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: isLoadingCategories } =
    useDrugCategories();
  const { data: forms = [], isLoading: isLoadingForms } = useDosageForms();
  const { data: pharmacies = [], isLoading: isLoadingPharmacies } =
    usePharmacies();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateMedicineFormValues>({
    resolver: zodResolver(createMedicineSchema),
  });

  const onSubmit = async (values: CreateMedicineFormValues) => {
    try {
      // Filter out empty strings for optional fields
      const payload: any = {
        name: values.name,
        dosageFormId: values.dosageFormId,
        pharmacyId: values.pharmacyId,
        status: values.status,
        notes: values.notes,
      };

      if (values.drugCategoryId && values.drugCategoryId !== "") {
        payload.drugCategoryId = values.drugCategoryId;
      }

      await createMedicine(payload);

      notify.success("Success", "Medicine created successfully");
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["useMedicines"] });
      reset();
      navigate("/medicines");
    } catch {
      notify.error("Failed", "Unable to create medicine");
    }
  };

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Medicines" path="/medicines" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-0 rounded-xl p-6 space-y-6"
      >
        <FormLabelLg>Add Medicine</FormLabelLg>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <FormLabel>Medicine Name</FormLabel>
            <FormInput {...register("name")} />
            <FieldError error={errors.name?.message} />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormLabel>Drug Category (Optional)</FormLabel>
            <Controller
              name="drugCategoryId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  options={categories}
                  value={field.value}
                  onChange={field.onChange}
                  loading={isLoadingCategories}
                />
              )}
            />
            <FieldError error={errors.drugCategoryId?.message} />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormLabel>Dosage Form</FormLabel>
            <Controller
              name="dosageFormId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  options={forms}
                  value={field.value}
                  onChange={field.onChange}
                  loading={isLoadingForms}
                />
              )}
            />
            <FieldError error={errors.dosageFormId?.message} />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormLabel>Status</FormLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  options={STATUS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormLabel>Pharmacy</FormLabel>
            <Controller
              name="pharmacyId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  options={pharmacies}
                  value={field.value}
                  onChange={field.onChange}
                  loading={isLoadingPharmacies}
                />
              )}
            />
          </div>

          <div className="col-span-12">
            <FormLabel>Notes</FormLabel>
            <textarea
              {...register("notes")}
              className="w-full border rounded-md p-3 min-h-[120px]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Medication"}
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
};

export default CreateMedicine;
