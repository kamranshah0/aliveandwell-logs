import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  roleId: z.string().min(1, "Role is required"),
  designation: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export default createUserSchema;
