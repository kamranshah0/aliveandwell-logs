import { z } from "zod";

export const generalSettingsSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
