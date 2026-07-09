import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend 
} from "recharts";
import { Card } from "../../../components/ui/card";
import { FinancialSummary } from "../../../types";

interface CostChartsProps {
  summaries: FinancialSummary[];
}

export const CostCharts: React.FC<CostChartsProps> = ({ summaries }) => {
  const chartData = summaries.map(s => ({
    name: `${s.month}/${s.year}`,
    cost: s.totalOsCost,
    impressions: s.totalImpressions
  })).reverse();

  const latest = summaries[0];
  const pieData = latest ? [
    { name: 'Peças', value: latest.totalPartsCost, color: '#6366f1' },
    { name: 'Mão de Obra', value: latest.totalLaborCost, color: '#8b5cf6' },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Evolução de Custos vs Impressões</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(val) => `R$ ${val}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="cost" fill="#6366f1" radius={[4, 4, 0, 0]} name="Custo Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Distribuição de Custos (Último Mês)</h3>
        <div className="h-[300px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Sem dados suficientes
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
