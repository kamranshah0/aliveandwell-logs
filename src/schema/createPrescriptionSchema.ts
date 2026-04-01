// src/schema/createPrescriptionSchema.ts
import { z } from "zod";

/**
 * Prescription schema
 * Fields (matching your screenshot):
 * - patientId: string (selected patient)
 * - medicationName: string
 * - dosage: string
 * - quantity: number
 * - refills: number
 * - rxDuration: string (we keep as string because options come from select)
 * - prescriber: string
 * - pharmacy: string
 * - startDate: optional ISO date string YYYY-MM-DD
 * - notes: optional string
 */
export const createPrescriptionSchema = z.object({
  patientId: z
    .string()
    .min(1, "Please select a patient")
    .regex(/^\S.*$/, "Invalid patient selection"),

  medicationName: z
    .string()
    .min(1, "Medication name is required")
    .max(200, "Medication name is too long"),

  dosage: z
    .string()
    .min(1, "Dosage is required")
    .max(100, "Dosage is too long"),

  quantity: z.preprocess(
    (v) => (typeof v === "string" ? parseInt(v, 10) : v),
    z.number().int().positive("Quantity must be a positive number").gte(1),
  ),

  refills: z.preprocess(
    (v) => (typeof v === "string" ? parseInt(v, 10) : v),
    z.number().int().nonnegative("Refills must be 0 or more").default(0),
  ),

  rxDuration: z.string().min(1, "Select RX duration").max(50),

  category: z.string().min(1, "Select Category").max(50),

  prescriber: z
    .string()
    .min(1, "Prescriber is required")
    .max(200, "Prescriber name is too long"),

  pharmacy: z.string().min(1, "Select pharmacy").max(200),

  // optional start date stored as string 'YYYY-MM-DD'
  startDate: z
    .string()
    .optional()
    .refine((s) => !s || /^\d{4}-\d{2}-\d{2}$/.test(s), {
      message: "Invalid date format (YYYY-MM-DD)",
    }),

  notes: z.string().optional(),
  // .max(2000, "Notes too long"),
});

export type CreatePrescriptionFormValues = z.infer<
  typeof createPrescriptionSchema
>;
export default createPrescriptionSchema;
