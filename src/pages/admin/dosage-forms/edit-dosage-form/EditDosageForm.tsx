import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import FieldError from "@/components/molecules/FieldError";
import FormLabel from "@/components/molecules/FormLabel";
import FormInput from "@/components/molecules/FormInput";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import { notify } from "@/components/ui/notify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { decryptText } from "@/utils/decryptAES";

import createDosageFormSchema, {
  type CreateDosageFormFormValues,
} from "@/schema/createDosageFormSchema";

import { getDosageFormById, updateDosageForm } from "@/api/dosage-form.api";

const EditDosageForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: form, isLoading } = useQuery({
    queryKey: ["dosage-form", id],
    queryFn: async () => {
      const res = await getDosageFormById(id!);
      const data = res.data.data;
      return {
        ...data,
        name: await decryptText(data.name),
        description: data.description ? await decryptText(data.description) : "",
      };
    },
    enabled: !!id,
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateDosageFormFormValues>({
    resolver: zodResolver(createDosageFormSchema),
  });

  useEffect(() => {
    if (form) {
      reset({
        name: form.name,
        description: form.description,
      });
    }
  }, [form, reset]);

  const onSubmit = async (values: CreateDosageFormFormValues) => {
    try {
      await updateDosageForm(id!, {
        name: values.name,
        description: values.description ?? undefined,
      });

      notify.success("Success", "Dosage form updated successfully");
      queryClient.invalidateQueries({ queryKey: ["dosage-forms"] });
      queryClient.invalidateQueries({ queryKey: ["dosage-forms-list"] });
      queryClient.invalidateQueries({ queryKey: ["dosage-form", id] });
      navigate("/dosage-forms");
    } catch {
      notify.error("Failed", "Unable to update dosage form");
    }
  };

  if (isLoading) {
    return (
      <MainWrapper>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Dosage Forms" path="/dosage-forms" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-0 rounded-xl p-6 space-y-6"
      >
        <FormLabelLg>Edit Dosage Form</FormLabelLg>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <FormLabel>Form Name</FormLabel>
            <FormInput {...register("name")} placeholder="Enter dosage form name" />
            <FieldError error={errors.name?.message} />
          </div>

          <div className="col-span-12">
            <FormLabel>Description</FormLabel>
            <textarea
              {...register("description")}
              placeholder="Enter optional description"
              className="w-full border rounded-md p-3 min-h-[120px] focus:outline-primary"
            />
            <FieldError error={errors.description?.message} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => navigate("/dosage-forms")}>
                Cancel
            </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Form"}
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
};

export default EditDosageForm;
