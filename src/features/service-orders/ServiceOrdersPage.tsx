import React, { useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { useServiceOrders } from "../../hooks/useServiceOrders";
import { useAuth } from "../../contexts/AuthContext";
import { DataTable } from "../../components/tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ServiceOrder } from "../../types";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { ServiceOrderForm } from "./ServiceOrderForm";

export const ServiceOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { orders, isLoading, deleteOrder } = useServiceOrders();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canCreate = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente arquivar esta OS?")) {
      await deleteOrder.mutateAsync(id);
    }
  };

  const columns: ColumnDef<ServiceOrder>[] = [
    {
      accessorKey: "number",
      header: "OS",
      cell: ({ row }) => (
        <Link to={`/service-orders/${row.original.id}`} className="font-bold text-indigo-600 hover:underline">
          #{String(row.original.number).padStart(5, '0')}
        </Link>
      ),
    },
    {
      accessorKey: "priority",
      header: "Prioridade",
      cell: ({ row }) => {
        const p = row.original.priority;
        const colors: Record<string, string> = {
          BAIXA: "bg-slate-100 text-slate-700",
          NORMAL: "bg-blue-100 text-blue-700",
          ALTA: "bg-amber-100 text-amber-700",
          URGENTE: "bg-red-100 text-red-700"
        };
        return <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${colors[p]}`}>{p}</span>;
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const colors: Record<string, string> = {
          ABERTA: "bg-slate-100 text-slate-700",
          AGUARDANDO_TECNICO: "bg-blue-100 text-blue-700",
          EM_ATENDIMENTO: "bg-indigo-100 text-indigo-700",
          AGUARDANDO_PECAS: "bg-amber-100 text-amber-700",
          AGUARDANDO_APROVACAO: "bg-orange-100 text-orange-700",
          FINALIZADA: "bg-green-100 text-green-700",
          ARQUIVADA: "bg-gray-100 text-gray-700"
        };
        const label = s.replace('_', ' ');
        return <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${colors[s] || colors.ABERTA}`}>{label}</span>;
      }
    },
    {
      accessorKey: "category",
      header: "Categoria",
    },
    {
      accessorKey: "openingDate",
      header: "Abertura",
      cell: ({ row }) => {
        const date = row.original.openingDate as any;
        if (!date) return "-";
        
        try {
          const d = date.seconds ? date.toDate() : new Date(date);
          if (isNaN(d.getTime())) return "-";
          return <span className="text-xs text-slate-600">{format(d, "dd/MM/yyyy HH:mm")}</span>;
        } catch (e) {
          return "-";
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link to={`/service-orders/${row.original.id}`}>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Visualizar
            </Button>
          </Link>
          {canCreate && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(row.original.id)} 
              className="h-8 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
            >
              Excluir
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="p-8 text-slate-500">Carregando...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            Ordens de Serviço
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gestão de chamados e manutenções.
          </p>
        </div>

        {canCreate && (
          <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova OS
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={orders} searchKey="number" />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Abrir Ordem de Serviço</DialogTitle>
          </DialogHeader>
          <ServiceOrderForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
