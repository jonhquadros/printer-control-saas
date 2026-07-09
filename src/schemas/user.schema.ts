import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional().or(z.literal("")),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN', 'CLIENT']),
  phone: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  companyId: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
