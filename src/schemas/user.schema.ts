import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(['ADMIN', 'TECHNICIAN', 'CLIENT']),
  phone: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type UserFormValues = z.infer<typeof userSchema>;
