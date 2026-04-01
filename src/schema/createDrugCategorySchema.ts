import { z } from "zod";

const createDrugCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name is required")
    .max(150, "Category name is too long"),

  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .nullable(),
});

export type CreateDrugCategoryFormValues = z.infer<
  typeof createDrugCategorySchema
>;

export default createDrugCategorySchema;
