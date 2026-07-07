import { z } from "zod";

export const osPartSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome da peça obrigatório"),
  quantity: z.coerce.number().min(1, "Quantidade deve ser maior que zero"),
  cost: z.coerce.number().min(0, "Custo deve ser positivo"),
});

export const serviceOrderSchema = z.object({
  printerId: z.string().min(1, "Impressora é obrigatória"),
  technicianId: z.string().optional(),
  priority: z.enum(['BAIXA', 'NORMAL', 'ALTA', 'URGENTE']),
  category: z.enum(['CORRETIVA', 'PREVENTIVA', 'INSTALACAO', 'RECOLHIMENTO']),
  problem: z.string().min(5, "Informe o problema (mínimo 5 caracteres)"),
});

export type ServiceOrderFormValues = z.infer<typeof serviceOrderSchema>;

export const osDiagnosisSchema = z.object({
  diagnosis: z.string().min(5, "Informe o diagnóstico"),
});

export const osSolutionSchema = z.object({
  technicalReport: z.string().min(5, "Informe o parecer técnico"),
  solution: z.string().min(5, "Informe a solução aplicada"),
});
