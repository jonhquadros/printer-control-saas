import { z } from "zod";

export type AuditModule = 
  | 'AUTH' 
  | 'COMPANIES' 
  | 'PRINTERS' 
  | 'SERVICE_ORDERS' 
  | 'USERS' 
  | 'FINANCIAL' 
  | 'WHATSAPP' 
  | 'AI' 
  | 'SYSTEM';

export type AuditAction = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'STATUS_CHANGE' 
  | 'INVITE' 
  | 'EXPORT' 
  | 'SIGNATURE' 
  | 'UPLOAD' 
  | 'WHATSAPP_SEND' 
  | 'AI_GENERATE';

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  userEmail: string;
  userName: string;
  module: AuditModule;
  action: AuditAction;
  entityId?: string;
  details: string;
  changes?: AuditChange[];
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

export const auditFilterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  userId: z.string().optional(),
  module: z.string().optional(),
  action: z.string().optional(),
  companyId: z.string().optional(), // Apenas para Super Admin
});

export type AuditFilter = z.infer<typeof auditFilterSchema>;
