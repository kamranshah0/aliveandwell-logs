// // src/schema/createPatientSchema.ts
// import { z } from "zod";

// /**
//  * Helpers for file validation
//  */
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
// const ALLOWED_FILE_TYPES = [
//   "image/png",
//   "image/jpeg",
//   "image/jpg",
//   "image/webp",
//   "application/pdf",
// ];

// /** refine to check File-ish objects in the browser */
// const fileSchema = z
//   .any()
//   .refine((f) => f === undefined || f === null || typeof File !== "undefined" && f instanceof File, {
//     message: "Invalid file",
//   })
//   .nullable()
//   .optional()
//   .refine((f) => {
//     if (!f) return true;
//     return ALLOWED_FILE_TYPES.includes((f as File).type);
//   }, `Only PNG/JPEG/WEBP/PDF files are allowed`)
//   .refine((f) => {
//     if (!f) return true;
//     return (f as File).size <= MAX_FILE_SIZE;
//   }, `File must be <= ${MAX_FILE_SIZE / (1024 * 1024)} MB`);

// /**
//  * Main schema
//  */
// export const createUserSchema = z.object({
//   // Personal
//   firstName: z.string().min(1, "First name is required").max(100),
//   lastName: z.string().min(1, "Last name is required").max(100),

//   // DOB   (accept yyyy-mm-dd string)
//   dob: z
//     .string()
//     .optional()
//     .refine((s) => {
//       if (!s) return true;
//       // basic ISO date check yyyy-mm-dd
//       return /^\d{4}-\d{2}-\d{2}$/.test(s);
//     }, "Date of birth must be in YYYY-MM-DD format"),

//   // gender
//   gender: z.enum(["male", "female", "other"]).optional(),

//   // Contact
//   cellNo: z
//     .string()
//     .optional()
//     .refine((v) => {
//       if (!v) return true;
//       // permissive phone validation: digits + + - spaces, 7..20 chars
//       return /^[+\d][\d\s\-().]{6,19}$/.test(v);
//     }, "Enter a valid phone number"),

//   email: z.string().email("Enter a valid email").optional(),

//   // Address & other
//   address: z.string().optional(),
//   city: z.string().optional(),
//   role: z.string().optional(),

//   // Documents: two separate controllers - insuranceCard and idCard
//   insuranceCard: fileSchema,
//   idCard: fileSchema,

// });

// /**
//  * Type for the form values
//  */
// export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// export default createUserSchema;

import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
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
    (f) =>
      !f ||
      f === "" ||
      (typeof File !== "undefined" &&
        f instanceof File &&
        ALLOWED_TYPES.includes(f.type) &&
        f.size <= MAX_FILE_SIZE),
    "Invalid file (PNG/JPG/WEBP/PDF, max 5MB)",
  );

const createPatientSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),

    email: z.string().email("Invalid email"),

    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain number")
      .regex(/[^A-Za-z0-9]/, "Must contain special character"),

    confirmPassword: z.string(),

    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD required"),

    gender: z.enum(["male", "female", "other"]),
    phone: z.string().min(7, "Phone is required"),
    address: z.string().min(1, "Address is required"),

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
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreatePatientFormValues = z.infer<typeof createPatientSchema>;
export default createPatientSchema;
