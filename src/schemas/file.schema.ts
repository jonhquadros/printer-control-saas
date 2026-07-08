import { z } from 'zod';

export const uploadConfigSchema = z.object({
  maxSizeBytes: z.number().positive(),
  acceptedFormats: z.array(z.string()),
  maxFiles: z.number().positive().max(50),
  compressionQuality: z.number().min(0.1).max(1),
  compressionMaxWidth: z.number().positive(),
});

export const fileMetadataSchema = z.object({
  empresaId: z.string().min(1),
  modulo: z.enum(['printers', 'service-orders']),
  entidadeId: z.string().min(1),
  categoria: z.enum(['foto-principal', 'fotos-defeito', 'fotos-manutencao', 'fotos-pecas', 'videos', 'documentos', 'manuais']),
  publicId: z.string().min(1),
  url: z.string().url(),
  urlOriginal: z.string().url(),
  format: z.string().min(1),
  resourceType: z.enum(['image', 'video', 'raw']),
  bytes: z.number().nonnegative(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  nomeOriginal: z.string().min(1),
  deleted: z.boolean().default(false),
  deletedAt: z.date().optional(),
  deletedBy: z.string().optional(),
  createdAt: z.date(),
  createdBy: z.string().min(1),
  updatedAt: z.date(),
  updatedBy: z.string().min(1),
  status: z.enum(['uploading', 'active', 'deleted']),
});

export const uploadRequestSchema = z.object({
  folder: z.string().min(1),
  publicId: z.string().min(1),
  resourceType: z.enum(['image', 'video', 'raw', 'auto']),
});

export const deleteFileSchema = z.object({
  fileId: z.string().min(1),
});
