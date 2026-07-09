import React from "react";
import { 
  Building2, 
  Printer, 
  ClipboardList, 
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { cn } from "../../lib/utils";
import { useCompanies } from "../../hooks/useCompanies";
import { usePrinters } from "../../hooks/usePrinters";
import { useServiceOrders } from "../../hooks/useServiceOrders";
import { useUsers } from "../../hooks/useUsers";
import { format } from "date-fns";

export const DashboardPage: React.FC = () => {
  const { companies, isLoading: loadingCompanies } = useCompanies();
  const { printers, isLoading: loadingPrinters } = usePrinters();
  const { orders, isLoading: loadingOrders } = useServiceOrders();
  const { users, isLoading: loadingUsers } = useUsers();

  const isLoading = loadingCompanies || loadingPrinters || loadingOrders || loadingUsers;

  const stats = [
    { 
      label: "Empresas Ativas", 
      value: companies.length.toString(), 
      icon: Building2, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Impressoras", 
      value: printers.length.toString(), 
      icon: Printer, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
    { 
      label: "OS Abertas", 
      value: orders.filter(o => o.status && o.status !== 'FINALIZADA' && o.status !== 'ARQUIVADA').length.toString(), 
      icon: ClipboardList, 
      color: "text-amber-600", 
      bg: "bg-amber-50" 
    },
    { 
      label: "Usuários", 
      value: users.length.toString(), 
      icon: TrendingUp, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50" 
    },
  ];

  const latestOrders = [...orders]
    .sort((a, b) => {
      const dateA = a.openingDate?.seconds ? a.openingDate.toDate() : new Date(a.openingDate);
      const dateB = b.openingDate?.seconds ? b.openingDate.toDate() : new Date(b.openingDate);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ABERTA': return "bg-slate-100 text-slate-700";
      case 'AGUARDANDO_TECNICO': return "bg-blue-100 text-blue-700";
      case 'EM_ATENDIMENTO': return "bg-indigo-100 text-indigo-700";
      case 'AGUARDANDO_PECAS': return "bg-amber-100 text-amber-700";
      case 'AGUARDANDO_APROVACAO': return "bg-orange-100 text-orange-700";
      case 'FINALIZADA': return "bg-green-100 text-green-700";
      case 'ARQUIVADA': return "bg-gray-100 text-gray-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ABERTA': return "Aberta";
      case 'AGUARDANDO_TECNICO': return "Aguardando Técnico";
      case 'EM_ATENDIMENTO': return "Em Atendimento";
      case 'AGUARDANDO_PECAS': return "Aguardando Peças";
      case 'AGUARDANDO_APROVACAO': return "Aguardando Aprovação";
      case 'FINALIZADA': return "Finalizada";
      case 'ARQUIVADA': return "Arquivada";
      default: return status.replace('_', ' ');
    }
  };
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando painel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 group-hover:text-indigo-600 transition-colors">
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid Split */}
      <div className="flex-1">
        {/* Table Section */}
        <Card className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h4 className="font-bold text-slate-800 text-sm">Últimas Ordens de Serviço</h4>
            <div className="flex items-center gap-2">
              <button className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-md transition-colors border border-transparent hover:border-indigo-100">
                Ver Todas →
              </button>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">OS</th>
                  <th className="px-6 py-4">Empresa / Equipamento</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {latestOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                      Nenhuma ordem de serviço encontrada.
                    </td>
                  </tr>
                ) : latestOrders.map((os) => {
                  const company = companies.find(c => c.id === os.companyId);
                  const printer = printers.find(p => p.id === os.printerId);
                  const openingDate = os.openingDate?.seconds ? os.openingDate.toDate() : new Date(os.openingDate);

                  return (
                    <tr key={os.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">#{String(os.number || 0).padStart(5, '0')}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-xs">{company?.name || "Empresa não encontrada"}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{printer?.model || os.printerId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider", getStatusColor(os.status))}>
                          {getStatusLabel(os.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[10px] text-slate-400 font-medium group-hover:text-slate-600">
                        {format(openingDate, "dd/MM/yyyy HH:mm")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
