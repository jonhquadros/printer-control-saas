import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { whatsappService } from "../services/whatsapp.service";
import { useAuth } from "../contexts/AuthContext";
import { WhatsAppConfig } from "../types";
import { toast } from "sonner";

export function useWhatsAppConfig() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const configQuery = useQuery({
    queryKey: ["whatsappConfig", user?.companyId],
    queryFn: () => whatsappService.getConfig(user?.companyId || ""),
    enabled: !!user?.companyId,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<WhatsAppConfig>) => 
      whatsappService.saveConfig(user?.companyId || "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsappConfig"] });
      toast.success("Configuração de WhatsApp salva com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao salvar configuração: " + error.message);
    }
  });

  return {
    config: configQuery.data,
    isLoading: configQuery.isLoading,
    saveConfig: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  };
}

export function useNotificationHistory() {
  const { user } = useAuth();

  const logsQuery = useQuery({
    queryKey: ["notificationLogs", user?.companyId],
    queryFn: () => whatsappService.getLogs(user?.companyId || ""),
    enabled: !!user?.companyId,
    refetchInterval: 30000, // Refresh every 30s
  });

  return {
    logs: logsQuery.data || [],
    isLoading: logsQuery.isLoading,
  };
}
