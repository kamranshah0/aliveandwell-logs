import MainWrapper from "@/components/molecules/MainWrapper";
import SecondaryHeader from "@/components/molecules/SecondaryHeader";
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

import createDrugCategorySchema, {
  type CreateDrugCategoryFormValues,
} from "@/schema/createDrugCategorySchema";

import { createDrugCategory } from "@/api/drug-category.api";

const CreateDrugCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateDrugCategoryFormValues>({
    resolver: zodResolver(createDrugCategorySchema),
  });

  const onSubmit = async (values: CreateDrugCategoryFormValues) => {
    try {
      await createDrugCategory({
        name: values.name,
        description: values.description,
      });

      notify.success("Success", "Drug category created successfully");
      queryClient.invalidateQueries({ queryKey: ["drug-categories"] });
      queryClient.invalidateQueries({ queryKey: ["drug-categories-list"] });
      reset();
      navigate("/drug-categories");
    } catch {
      notify.error("Failed", "Unable to create drug category");
    }
  };

  return (
    <MainWrapper className="flex flex-col gap-6">
      <SecondaryHeader title="Back to Drug Categories" path="/drug-categories" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-0 rounded-xl p-6 space-y-6"
      >
        <FormLabelLg>Add Drug Category</FormLabelLg>

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
            {isSubmitting ? "Saving..." : "Add Category"}
          </Button>
        </div>
      </form>
    </MainWrapper>
  );
};

export default CreateDrugCategory;
