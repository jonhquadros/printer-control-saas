import React, { useState, useMemo } from "react";
import { 
  History, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  Trash2,
  Calendar,
  BarChart3
} from "lucide-react";
import { Printer, PrinterCounter } from "../../types";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { useCounters } from "../../hooks/useCounters";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { CounterForm } from "./CounterForm";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format, differenceInDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { exportToCSV } from "../../utils/export";
import { cn } from "../../lib/utils";

interface CountersTabProps {
  printer: Printer;
}

export const CountersTab: React.FC<CountersTabProps> = ({ printer }) => {
  const { counters, isLoading, deleteCounter } = useCounters(printer.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- Calculations ---
  const stats = useMemo(() => {
    if (counters.length === 0) return { dailyAvg: 0, monthlyUsage: 0, projection: 0 };

    const sortedCounters = [...counters].sort((a, b) => a.date.seconds - b.date.seconds);
    const first = sortedCounters[0];
    const last = sortedCounters[sortedCounters.length - 1];
    
    const daysDiff = Math.max(1, differenceInDays(
      new Date(last.date.seconds * 1000), 
      new Date(first.date.seconds * 1000)
    ));
    
    const totalVolume = last.counter - first.counter;
    const dailyAvg = totalVolume / daysDiff;
    
    // Usage in current month
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const currentMonthCounters = counters.filter(c => {
      const d = new Date(c.date.seconds * 1000);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    });

    let monthlyUsage = 0;
    if (currentMonthCounters.length >= 2) {
      const sortedMonth = [...currentMonthCounters].sort((a, b) => a.date.seconds - b.date.seconds);
      monthlyUsage = sortedMonth[sortedMonth.length - 1].counter - sortedMonth[0].counter;
    }

    return {
      dailyAvg: Math.round(dailyAvg),
      monthlyUsage: Math.round(monthlyUsage),
      projection: Math.round(dailyAvg * 30)
    };
  }, [counters]);

  // --- Chart Data ---
  const chartData = useMemo(() => {
    return [...counters]
      .sort((a, b) => a.date.seconds - b.date.seconds)
      .map(c => ({
        date: format(new Date(c.date.seconds * 1000), "dd/MM"),
        valor: c.counter,
        consumo: c.delta || 0
      }))
      .slice(-10); // last 10 readings
  }, [counters]);

  const handleExport = () => {
    const exportData = counters.map(c => ({
      Data: format(new Date(c.date.seconds * 1000), "dd/MM/yyyy HH:mm"),
      Contador: c.counter,
      Consumo: c.delta || 0,
      Tecnico: c.technicianName,
      Origem: c.origin,
      Observacao: c.observation || ""
    }));
    exportToCSV(exportData, `leituras-${printer.serialNumber}.csv`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja excluir este registro de contador?")) {
      await deleteCounter.mutateAsync(id);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Carregando histórico...</div>;

  const isMaintenanceCritical = printer.maintenanceLimit && printer.currentCounter >= printer.maintenanceLimit;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          Gestão de Leituras
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={
              <Button size="sm" className="bg-indigo-600 text-white flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700">
                <Plus className="w-4 h-4" /> Nova Leitura
              </Button>
            } />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Contador</DialogTitle>
              </DialogHeader>
              <CounterForm printerId={printer.id} onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Contador Atual</Label>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{printer.currentCounter.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-slate-400 font-medium">págs</span>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Média Diária</Label>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-indigo-600">{stats.dailyAvg}</span>
            <span className="text-xs text-slate-400 font-medium">págs/dia</span>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Volume no Mês</Label>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{stats.monthlyUsage.toLocaleString('pt-BR')}</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </Card>
        <Card className={cn("p-4 border-slate-200", isMaintenanceCritical && "border-red-200 bg-red-50")}>
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Manutenção Prev.</Label>
          <div className="flex items-center gap-2 mt-1">
             <span className={cn("text-2xl font-bold", isMaintenanceCritical ? "text-red-600" : "text-slate-900")}>
               {printer.maintenanceLimit ? (printer.maintenanceLimit - printer.currentCounter).toLocaleString('pt-BR') : "---"}
             </span>
             {isMaintenanceCritical && <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />}
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Páginas restantes</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Evolução do Volume</h4>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Últimas 10 coletas</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-300" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="consumo" 
                  name="Consumo"
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity List */}
        <Card className="p-6">
          <h4 className="font-bold text-slate-800 text-sm mb-6">Últimas Leituras</h4>
          <div className="space-y-4">
            {counters.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{c.counter.toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {format(new Date(c.date.seconds * 1000), "dd 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border-indigo-100">
                    +{c.delta || 0}
                  </Badge>
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="ml-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {counters.length === 0 && (
              <div className="text-center py-8">
                <History className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sem histórico</p>
              </div>
            )}
          </div>
          {counters.length > 5 && (
            <Button variant="ghost" className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600">
              Ver Histórico Completo
            </Button>
          )}
        </Card>
      </div>

      {/* Full History Table */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm">Log Completo de Atividades</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contador</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Delta</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Técnico</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Origem</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {counters.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-700">
                      {format(new Date(c.date.seconds * 1000), "dd/MM/yyyy HH:mm")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold font-mono text-slate-900">{c.counter.toLocaleString('pt-BR')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-green-600">+{c.delta || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600 font-medium">{c.technicianName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-tighter">
                      {c.origin}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(c.id)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
