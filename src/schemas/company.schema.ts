import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cnpj: z.string().min(18, "CNPJ inválido"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(14, "Telefone inválido"),
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras (UF)"),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
