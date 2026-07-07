import React, { useState } from "react";
import { Printer as PrinterIcon, Plus } from "lucide-react";
import { usePrinters } from "../../hooks/usePrinters";
import { useAuth } from "../../contexts/AuthContext";
import { DataTable } from "../../components/tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Printer } from "../../types";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { PrinterForm } from "./PrinterForm";

export const PrintersPage: React.FC = () => {
  const { user } = useAuth();
  const { printers, isLoading, deletePrinter } = usePrinters();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleEdit = (printer: Printer) => {
    setEditingPrinter(printer);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingPrinter(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta impressora?")) {
      await deletePrinter.mutateAsync(id);
    }
  };

  const columns: ColumnDef<Printer>[] = [
    {
      accessorKey: "assetNumber",
      header: "Patrimônio",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-slate-500">
          {row.original.assetNumber || "---"}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Impressora",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link to={`/printers/${row.original.id}`} className="font-bold text-indigo-600 hover:underline">
            {row.original.name}
          </Link>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            {row.original.brand} {row.original.model}
          </span>
        </div>
      ),
    },
    { accessorKey: "serialNumber", header: "Nº Série" },
    { 
      id: "location",
      header: "Localização",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-xs text-slate-700 font-medium">{row.original.unit || "---"}</span>
          <span className="text-[10px] text-slate-400 uppercase">{row.original.sector || "---"}</span>
        </div>
      )
    },
    { 
      accessorKey: "currentCounter", 
      header: "Contador",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-bold text-indigo-600">
          {row.original.currentCounter.toLocaleString('pt-BR')}
        </span>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)} className="h-8 text-xs text-slate-600 hover:text-indigo-600">
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)} className="h-8 text-xs text-slate-400 hover:text-red-600">
            Excluir
          </Button>
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
            <PrinterIcon className="w-6 h-6 text-indigo-600" />
            Impressoras
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gestão do parque de impressão.
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Impressora
        </Button>
      </div>

      <DataTable columns={columns} data={printers} searchKey="name" />

      <Dialog open={isFormOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingPrinter ? "Editar Impressora" : "Nova Impressora"}</DialogTitle>
          </DialogHeader>
          <PrinterForm 
            initialData={editingPrinter}
            onSuccess={handleClose} 
            isSuperAdmin={isSuperAdmin}
            currentCompanyId={user?.companyId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
