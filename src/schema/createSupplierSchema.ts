import { z } from "zod";

export const createSupplierSchema = z.object({
    profileImg: z.instanceof(File, { message: "Profile image is required" }).optional(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  companyName: z.string().min(1, "First Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  cellNo: z.string().min(1, "Cell No is required"),
  country: z.string().optional(),
  city: z.string().optional(),
  role: z.string().optional(),
  companyRole: z.string().optional(),
  address: z.string().optional(),
});

export type CreateSupplierFormValues = z.infer<typeof createSupplierSchema>;
