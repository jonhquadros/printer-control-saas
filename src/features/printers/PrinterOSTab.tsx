import React from "react";
import { Printer, ServiceOrder } from "../../types";
import { useServiceOrders } from "../../hooks/useServiceOrders";
import { DataTable } from "../../components/tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "../../components/ui/button";

interface PrinterOSTabProps {
  printer: Printer;
}

export const PrinterOSTab: React.FC<PrinterOSTabProps> = ({ printer }) => {
  const { orders, isLoading } = useServiceOrders();
  
  const printerOrders = orders.filter((o) => o.printerId === printer.id);

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
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="p-8 text-slate-500">Carregando...</div>;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Histórico de OS</h3>
      <DataTable columns={columns} data={printerOrders} searchKey="number" />
    </div>
  );
};
