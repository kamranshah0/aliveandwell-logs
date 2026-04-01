import { z } from "zod";

const createDosageFormSchema = z.object({
  name: z
    .string()
    .min(2, "Dosage form name is required")
    .max(150, "Dosage form name is too long"),

  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .nullable(),
});

export type CreateDosageFormFormValues = z.infer<
  typeof createDosageFormSchema
>;

export default createDosageFormSchema;
