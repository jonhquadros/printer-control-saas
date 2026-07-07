import React from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { WhatsAppConfigForm } from "./WhatsAppConfigForm";
import { useWhatsAppConfig } from "../../hooks/useWhatsApp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { NotificationHistoryTable } from "./NotificationHistoryTable";

export const WhatsAppPage: React.FC = () => {
  const { config, isLoading, saveConfig, isSaving } = useWhatsAppConfig();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="WhatsApp & Notificações" 
        subtitle="Configure o envio de mensagens automáticas e acompanhe o histórico"
      />

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <TabsTrigger value="config" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Configurações
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Histórico de Envios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <WhatsAppConfigForm 
            initialData={config} 
            onSave={saveConfig} 
            isLoading={isSaving || isLoading} 
          />
        </TabsContent>

        <TabsContent value="history">
          <NotificationHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};
