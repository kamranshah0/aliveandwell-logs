import { z } from "zod";

export const addExpenseSchema = z.object({
  supplierName: z
    .string()
    .min(2, "Supplier name is required and must be at least 2 characters long"),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number")
    .min(1, "Amount is required"),
  serviceType: z.string().min(2, "Service Type is required"),
  recent: z.string().optional(),

  expenseInvoice: z
    .instanceof(File, { message: "Invalid file format" })
    .optional(),
  chequeReceipt: z
    .instanceof(File, { message: "Invalid file format" })
    .optional(),

  markAsPaid: z.boolean().optional(),
});

export type AddExpenseFormValues = z.infer<typeof addExpenseSchema>;
