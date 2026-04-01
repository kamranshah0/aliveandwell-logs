// import { z } from "zod";

// export const createPrescriptionSchema = z.object({
//   medicationName: z
//     .string()
//     .min(1, "Medication name is required"),

//   drugCategory: z
//     .string()
//     .min(1, "Please select drug category"),

//   formType: z
//     .string()
//     .min(1, "Please select form"),

//   status: z
//     .string()
//     .min(1, "Please select status"),

//   prescriber: z
//     .string()
//     .min(1, "Select prescriber"),

//   pharmacy: z
//     .string()
//     .min(1, "Select pharmacy"),

//   notes: z.string().optional(),
//   image: z
//   .any()
//   .refine((file) => file instanceof File, "Image is required")
//   .optional(),
// });

// export type CreatePrescriptionFormValues = z.infer<
//   typeof createPrescriptionSchema
// >;
// export default createPrescriptionSchema;
import { z } from "zod";

/**
 * Backend expects:
 * {
 *   name: string
 *   drugCategoryId: uuid
 *   dosageFormId: uuid
 *   pharmacyId: uuid
 *   status: "ACTIVE" | "INACTIVE"
 *   notes?: string
 * }
 */

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const createMedicineSchema = z.object({
  name: z
    .string()
    .min(2, "Medicine name is required")
    .max(150, "Medicine name is too long"),

  drugCategoryId: z
    .string()
    .regex(uuidRegex, "Invalid drug category")
    .optional()
    .or(z.literal("")),

  dosageFormId: z
    .string()
    .regex(uuidRegex, "Invalid dosage form"),

  pharmacyId: z
    .string()
    .regex(uuidRegex, "Invalid pharmacy"),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .refine((val) => val !== undefined, {
      message: "Status is required",
    }),

  notes: z
    .string()
    .max(1000, "Notes are too long")
    .optional()
    .nullable(),
});

export type CreateMedicineFormValues = z.infer<
  typeof createMedicineSchema
>;

export default createMedicineSchema;
