import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Package, 
  Users, 
  Calendar, 
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useFinancialDashboard } from "../../hooks/useFinancial";
import { FinancialKPICard } from "./components/FinancialKPICard";
import { CostCharts } from "./components/CostCharts";
import { ProductivityTable } from "./components/ProductivityTable";
import { Button } from "../../components/ui/button";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { Link } from "react-router-dom";

export const FinancialPage: React.FC = () => {
  const [period, setPeriod] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });

  const { kpis, productivity, summaries, isLoading } = useFinancialDashboard(period);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando painel financeiro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            Gestão Financeira
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Controle de custos, peças e produtividade.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/financial/parts">
            <Button variant="outline" className="text-xs h-9">
              <Package className="w-4 h-4 mr-2" />
              Estoque de Peças
            </Button>
          </Link>
          <Button variant="outline" className="text-xs h-9">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialKPICard 
          label="Custo Total OS"
          value={`R$ ${kpis?.totalCostPeriod.toLocaleString('pt-BR')}`}
          icon={TrendingUp}
          color="text-indigo-600"
          bg="bg-indigo-50"
          description={`OS finalizadas no período`}
        />
        <FinancialKPICard 
          label="Custo por Impressão"
          value={`R$ ${kpis?.costPerImpression.toFixed(4)}`}
          icon={TrendingUp}
          color="text-amber-600"
          bg="bg-amber-50"
          description="Média baseada no volume"
        />
        <FinancialKPICard 
          label="Custo Médio OS"
          value={`R$ ${kpis?.averageOsCost.toLocaleString('pt-BR')}`}
          icon={Settings}
          color="text-emerald-600"
          bg="bg-emerald-50"
          description="Ticket médio de manutenção"
        />
        <FinancialKPICard 
          label="Total Impressões"
          value={kpis?.totalImpressions.toLocaleString('pt-BR') || "0"}
          icon={Users}
          color="text-blue-600"
          bg="bg-blue-50"
          description="Volume total processado"
        />
      </div>

      {/* Charts */}
      <CostCharts summaries={summaries} />

      {/* Productivity Table */}
      <ProductivityTable data={productivity} />
    </div>
  );
};
