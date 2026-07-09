import { z } from "zod";

export const partSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  unitCost: z.number().min(0, "Custo deve ser maior ou igual a zero"),
  stock: z.number().int().min(0, "Estoque deve ser maior ou igual a zero"),
  minStock: z.number().int().min(0).optional(),
});

export type PartFormValues = z.infer<typeof partSchema>;

export const costConfigSchema = z.object({
  laborRatePerHour: z.number().min(0, "Valor da hora deve ser maior ou igual a zero"),
  defaultPartMarkup: z.number().min(0).optional(),
});

export type CostConfigFormValues = z.infer<typeof costConfigSchema>;
