import { z } from "zod";

export const addStopSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  companyAddress: z.string().min(1, "Company Address is required"),
  phone: z.string().min(1, "Phone is required"),
  deliveryDate: z
      .date()
      .nullable()
      .refine((v) => v !== null, { message: "Delivery date is required" }),
  contactPerson: z.string().min(1, "Contact Person is required"),
  specialInstructions: z.string().optional(),
});

export type AddStopSchemaFormValues = z.infer<typeof addStopSchema>;
