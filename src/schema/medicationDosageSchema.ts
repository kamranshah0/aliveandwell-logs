import { z } from "zod";

export const medicationDosageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  unit: z.number().min(1, "Unit must be at least 1"),
  value: z.number().min(1, "Value must be at least 1"),
  unitType: z.enum(["DAY", "WEEK", "MONTH", "EVERY_X_DAYS"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type MedicationDosageSchema = z.infer<typeof medicationDosageSchema>;
