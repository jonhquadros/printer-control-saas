import { z } from "zod";

export const whatsappConfigSchema = z.object({
  provider: z.enum(['EVOLUTION', 'META', 'TWILIO']),
  apiUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  apiKey: z.string().min(5, "Chave de API muito curta").optional().or(z.literal("")),
  phoneNumber: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  instanceName: z.string().min(2, "Nome da instância inválido").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  templates: z.record(z.string()).default({
    OS_OPENED: "Olá {{clientName}}, sua OS #{{osNumber}} foi aberta para a impressora {{printerModel}}.",
    TECHNICIAN_ON_WAY: "O técnico {{technicianName}} está a caminho para realizar o atendimento da OS #{{osNumber}}.",
    OS_COMPLETED: "Atendimento finalizado! Segue em anexo o relatório técnico da OS #{{osNumber}}."
  }),
});

export type WhatsAppConfigInput = z.infer<typeof whatsappConfigSchema>;
