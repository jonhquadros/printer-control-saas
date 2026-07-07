import { z } from "zod";

export const reportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  companyId: z.string().optional(),
  printerId: z.string().optional(),
  technicianId: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
});

export const reportRequestSchema = z.object({
  type: z.enum([
    'PRINTER_HISTORY',
    'COMPANY_HISTORY',
    'OS_PERIOD',
    'COSTS',
    'PARTS',
    'COUNTER_EVOLUTION',
    'PREVENTIVE',
    'SLA'
  ]),
  format: z.enum(['PDF', 'EXCEL', 'CSV']),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  filters: reportFilterSchema,
});

export type ReportRequest = z.infer<typeof reportRequestSchema>;
