import { z } from "zod";

export const fileMetadataSchema = z.object({
  moduleId: z.enum(['SERVICE_ORDERS', 'PRINTERS', 'COMPANIES']),
  entityId: z.string().min(1, "ID da entidade é obrigatório"),
  category: z.enum(['fotos-defeito', 'fotos-manutencao', 'fotos-pecas', 'videos', 'documentos', 'manuais']),
  originalName: z.string(),
  size: z.number(),
  type: z.string(),
});

export const uploadConfigSchema = z.object({
  maxSizeMB: z.number().default(10),
  allowedTypes: z.array(z.string()).default(['image/*', 'application/pdf', 'video/*']),
  compressImages: z.boolean().default(true),
  maxWidthOrHeight: z.number().default(1920),
});
