import { z } from "zod";

export const printerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  serialNumber: z.string().min(3, "Número de série é obrigatório"),
  brand: z.string().min(2, "Marca é obrigatória"),
  model: z.string().min(2, "Modelo é obrigatório"),
  assetNumber: z.string().optional(),
  unit: z.string().optional(),
  sector: z.string().optional(),
  ip: z.string().optional(),
  mac: z.string().optional(),
  location: z.string().optional(),
  companyId: z.string().min(1, "Empresa é obrigatória"),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "WAITING_PARTS"]),
  initialCounter: z.preprocess((val) => Number(val), z.number().min(0, "Contador inicial não pode ser negativo")),
  currentCounter: z.preprocess((val) => Number(val), z.number().min(0, "Contador atual não pode ser negativo")),
  maintenanceLimit: z.preprocess((val) => Number(val || 0), z.number().min(0)).optional(),
  observations: z.string().optional(),
});

export type PrinterFormValues = z.infer<typeof printerSchema>;
