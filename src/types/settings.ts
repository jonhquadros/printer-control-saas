import { z } from "zod";

export interface CompanySettings {
  companyId: string;
  maintenanceThresholdPages: number;
  maintenanceThresholdDays: number;
  whatsappEnabled: boolean;
  whatsappToken?: string;
  aiEnabled: boolean;
  notificationPreferences: {
    osCreated: boolean;
    osAssigned: boolean;
    osFinished: boolean;
    maintenanceDue: boolean;
  };
  plan: {
    name: 'Starter' | 'Professional' | 'Enterprise';
    maxPrinters: number;
    maxUsers: number;
  };
  updatedAt: Date;
}

export const companySettingsSchema = z.object({
  maintenanceThresholdPages: z.number().min(100, "Mínimo 100 páginas"),
  maintenanceThresholdDays: z.number().min(30, "Mínimo 30 dias"),
  whatsappEnabled: z.boolean(),
  whatsappToken: z.string().optional(),
  aiEnabled: z.boolean(),
  notificationPreferences: z.object({
    osCreated: z.boolean(),
    osAssigned: z.boolean(),
    osFinished: z.boolean(),
    maintenanceDue: z.boolean(),
  }),
});

export type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;

export interface InAppNotification {
  id: string;
  companyId: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  link?: string;
  timestamp: Date;
}

export interface SearchResult {
  id: string;
  type: 'PRINTER' | 'OS' | 'USER' | 'COMPANY';
  title: string;
  subtitle: string;
  link: string;
}
