import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
];

const fileSchema = z
  .any()
  .optional()
  .nullable()
  .refine(
    (f) => !f || f === "" || (typeof File !== "undefined" && f instanceof File),
    "Invalid file",
  )
  .refine(
    (f) => !f || f === "" || ALLOWED_FILE_TYPES.includes(f.type),
    "Only PNG/JPEG/WEBP/PDF allowed",
  )
  .refine(
    (f) => !f || f === "" || f.size <= MAX_FILE_SIZE,
    "Max file size 5MB",
  );

const editPatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(), // readonly but still validated
  phone: z.string().min(1),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  status: z.enum(["active", "inactive"]),

  // Custom Fields
  bin: z.string().optional().or(z.literal("")),
  insuranceId: z.string().optional().or(z.literal("")),
  insuranceName: z.string().optional().or(z.literal("")),
  lastCmpLab: z.string().optional().or(z.literal("")),
  nextRxDate: z.string().optional().or(z.literal("")),
  officeLocation: z.string().optional().or(z.literal("")),
  pcn: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  zip: z.string().optional().or(z.literal("")),

  insuranceCard: fileSchema,
  insuranceCardBack: fileSchema,
  idCard: fileSchema,
  idCardBack: fileSchema,
});

export type EditPatientFormValues = z.infer<typeof editPatientSchema>;
export default editPatientSchema;
