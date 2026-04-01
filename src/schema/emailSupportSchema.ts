import { z } from "zod";

export const emailSupportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  category: z.string().min(1, "Phone is required"),
  shipmentId: z.string().min(1, "Shipment ID is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type EmailSupportSchemaFormValues = z.infer<typeof emailSupportSchema>;
