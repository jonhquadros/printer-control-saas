import React from "react";
import { ServiceOrder, OSStatus } from "../../types";
import { useServiceOrder } from "../../hooks/useServiceOrders";
import { useAuth } from "../../contexts/AuthContext";
import { useWhatsAppConfig } from "../../hooks/useWhatsApp";
import { whatsappService } from "../../services/whatsapp.service";
import { Button } from "../../components/ui/button";

const FLOW: OSStatus[] = [
  'ABERTA', 
  'AGUARDANDO_TECNICO', 
  'EM_ATENDIMENTO', 
  'AGUARDANDO_PECAS', 
  'AGUARDANDO_APROVACAO', 
  'FINALIZADA', 
  'ARQUIVADA'
];

export const OSStatusFlow: React.FC<{ order: ServiceOrder }> = ({ order }) => {
  const { updateStatus } = useServiceOrder(order.id);
  const { user } = useAuth();
  const { config } = useWhatsAppConfig();
  
  const canUpdate = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'TECHNICIAN';

  const currentIndex = FLOW.indexOf(order.status);

  const triggerNotification = async (status: OSStatus) => {
    if (!config?.isActive) return;

    let event: any = null;
    if (status === 'AGUARDANDO_TECNICO') event = 'OS_OPENED';
    if (status === 'EM_ATENDIMENTO') event = 'SERVICE_START';
    if (status === 'FINALIZADA') event = 'OS_COMPLETED';

    if (event) {
      const message = config.templates[event]
        ?.replace('{{osNumber}}', String(order.number).padStart(5, '0'))
        ?.replace('{{printerModel}}', 'Equipamento') // Should fetch printer model if available
        ?.replace('{{clientName}}', 'Cliente');

      await whatsappService.sendNotification({
        companyId: order.companyId,
        recipient: "5511999999999", // Mock recipient
        message: message || "Status da OS atualizado.",
        event: event,
        orderId: order.id
      });
    }
  };

  const handleNext = async () => {
    if (currentIndex < FLOW.length - 1) {
      const nextStatus = FLOW[currentIndex + 1];
      if (nextStatus === 'FINALIZADA') {
        if (!order.technicianSignatureUrl || !order.clientSignatureUrl) {
          alert("As assinaturas do técnico e cliente são obrigatórias para finalizar a OS.");
          return;
        }
      }
      await updateStatus.mutateAsync(nextStatus);
      await triggerNotification(nextStatus);
    }
  };

  const handleSetStatus = async (status: OSStatus) => {
    const newIndex = FLOW.indexOf(status);
    
    // Regressão check
    if (newIndex < currentIndex) {
      if (!confirm(`Você está voltando o status de "${order.status}" para "${status}". Esta ação será registrada na auditoria. Deseja continuar?`)) {
        return;
      }
    }

    if (status === 'FINALIZADA' && (!order.technicianSignatureUrl || !order.clientSignatureUrl)) {
      alert("As assinaturas do técnico e cliente são obrigatórias para finalizar a OS.");
      return;
    }
    await updateStatus.mutateAsync(status);
    await triggerNotification(status);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Avançar Status (Auditoria Automática)</h3>
      <div className="flex flex-wrap gap-2">
        {canUpdate && FLOW.map((status, index) => (
          <Button 
            key={status} 
            variant={order.status === status ? "default" : "outline"}
            size="sm"
            onClick={() => handleSetStatus(status)}
            disabled={updateStatus.isPending}
            className={order.status === status ? "bg-indigo-600 text-white" : "text-xs"}
          >
            {status.replace('_', ' ')}
          </Button>
        ))}
      </div>
      {canUpdate && currentIndex < FLOW.length - 1 && (
        <div className="pt-2">
          <Button onClick={handleNext} disabled={updateStatus.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Avançar para {FLOW[currentIndex + 1].replace('_', ' ')}
          </Button>
        </div>
      )}
    </div>
  );
};
