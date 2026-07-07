import { z } from "zod";

export const counterSchema = z.object({
  printerId: z.string().min(1, "ID da impressora é obrigatório"),
  companyId: z.string().min(1, "ID da empresa é obrigatório"),
  date: z.any(),
  technicianId: z.string().min(1, "ID do técnico é obrigatório"),
  technicianName: z.string().min(1, "Nome do técnico é obrigatório"),
  counter: z.preprocess((val) => Number(val), z.number().min(0, "Contador não pode ser negativo")),
  origin: z.enum(["MANUAL", "SNMP", "API"]),
  observation: z.string().optional(),
});

export type CounterFormData = {
  printerId: string;
  companyId: string;
  date: string;
  technicianId: string;
  technicianName: string;
  counter: number;
  origin: "MANUAL" | "SNMP" | "API";
  observation?: string;
};
