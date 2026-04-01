import { z } from "zod";

export const createRoleSchema = z.object({
  role: z.string().nonempty("Role is required"),
  permissions: z.array(z.string()).min(0).default([]), // explicitly min(0)
});
export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;