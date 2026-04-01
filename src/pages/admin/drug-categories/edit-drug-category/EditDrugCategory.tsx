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

import createDrugCategorySchema, {
  type CreateDrugCategoryFormValues,
} from "@/schema/createDrugCategorySchema";

import { getDrugCategoryById, updateDrugCategory } from "@/api/drug-category.api";

const EditDrugCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: category, isLoading } = useQuery({
    queryKey: ["drug-category", id],
    queryFn: async () => {
      const res = await getDrugCategoryById(id!);
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
  } = useForm<CreateDrugCategoryFormValues>({
    resolver: zodResolver(createDrugCategorySchema),
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
      });
    }
  }, [category, reset]);

  const onSubmit = async (values: CreateDrugCategoryFormValues) => {
    try {
      await updateDrugCategory(id!, {
        name: values.name,
        description: values.description ?? undefined,
      });

      notify.success("Success", "Drug category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["drug-categories"] });
      queryClient.invalidateQueries({ queryKey: ["drug-categories-list"] });
      queryClient.invalidateQueries({ queryKey: ["drug-category", id] });
      navigate("/drug-categories");
    } catch {
      notify.error("Failed", "Unable to update drug category");
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
      <SecondaryHeader title="Back to Drug Categories" path="/drug-categories" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-0 rounded-xl p-6 space-y-6"
      >
        <FormLabelLg>Edit Drug Category</FormLabelLg>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <FormLabel>Category Name</FormLabel>
            <FormInput {...register("name")} placeholder="Enter category name" />
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
            <Button variant="outline" type="button" onClick={() => navigate("/drug-categories")}>
                Cancel
            </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Category"}
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
};

export default EditDrugCategory;
