import React from "react";
import { Sparkles } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";

export const AIPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Inteligência Artificial" 
        subtitle="Insights e predições para manutenção preventiva"
      />
      <EmptyState 
        icon={Sparkles}
        title="IA em Breve"
        description="Utilize o poder da IA para prever falhas e otimizar rotas de técnicos."
      />
    </div>
  );
};
