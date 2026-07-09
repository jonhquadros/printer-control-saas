import React, { useState } from "react";
import { Plus, Building2, ShieldAlert, Printer as PrinterIcon } from "lucide-react";
import { useCompanies } from "../../hooks/useCompanies";
import { usePrinters } from "../../hooks/usePrinters";
import { useAuth } from "../../contexts/AuthContext";
import { DataTable } from "../../components/tables/DataTable";
import { Button } from "../../components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Company } from "../../types";
import { format } from "date-fns";
import { CompanyForm } from "./CompanyForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { PrinterForm } from "../printers/PrinterForm";

export const CompaniesPage: React.FC = () => {
  const { user } = useAuth();
  const { companies, myCompany, isLoading, deleteCompany } = useCompanies();
  const { printers } = usePrinters();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPrinterFormOpen, setIsPrinterFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompanyForPrinter, setSelectedCompanyForPrinter] = useState<Company | null>(null);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleAddPrinter = (company: Company) => {
    setSelectedCompanyForPrinter(company);
    setIsPrinterFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  const handlePrinterClose = () => {
    setIsPrinterFormOpen(false);
    setSelectedCompanyForPrinter(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente excluir esta empresa? (Isso a tornará inativa)")) {
      await deleteCompany.mutateAsync(id);
    }
  };

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Empresa",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.logoUrl ? (
            <img src={row.original.logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover border border-slate-200" />
          ) : (
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
              {row.original.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="font-bold text-slate-900 text-sm">{row.original.name || "Sem Nome"}</p>
            <p className="text-[10px] text-slate-500">{row.original.cnpj}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plano",
      cell: ({ row }) => {
        const plan = row.original.plan;
        const colors = {
          STARTER: "bg-slate-100 text-slate-700",
          PROFESSIONAL: "bg-indigo-100 text-indigo-700",
          ENTERPRISE: "bg-purple-100 text-purple-700"
        };
        return (
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${colors[plan]}`}>
            {plan}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colors = {
          ACTIVE: "bg-green-100 text-green-700",
          INACTIVE: "bg-amber-100 text-amber-700",
          BLOCKED: "bg-red-100 text-red-700"
        };
        return (
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${colors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "printers_count",
      header: "Impressoras",
      cell: ({ row }) => {
        const companyPrinters = printers.filter(p => p.companyId === row.original.id);
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {companyPrinters.length}
          </span>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "Cadastro",
      cell: ({ row }) => {
        const date = row.original.createdAt as any;
        if (!date) return "-";
        try {
          const d = date instanceof Date ? date : (date.seconds ? date.toDate() : new Date(date));
          if (isNaN(d.getTime())) return "-";
          return <span className="text-xs text-slate-500 font-medium">{format(d, "dd/MM/yyyy")}</span>;
        } catch (e) {
          return "-";
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        isAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)} className="text-xs h-8">
              Editar
            </Button>
            {isSuperAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDelete(row.original.id)} 
                className="h-8 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
              >
                Excluir
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAddPrinter(row.original)} 
              className="text-xs h-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <PrinterIcon className="w-3.5 h-3.5 mr-1" />
              Add Impressora
            </Button>
          </div>
        )
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-slate-500">Carregando...</div>;
  }

  // Se for admin, só vê a própria empresa, ou se super admin, vê todas.
  const displayData = isSuperAdmin ? companies : (myCompany ? [myCompany] : []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            Empresas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isSuperAdmin ? "Gestão global de empresas e planos." : "Dados da sua empresa."}
          </p>
        </div>

        {isSuperAdmin && (
          <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Empresa
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={displayData} searchKey="name" />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
          </DialogHeader>
          <CompanyForm 
            initialData={editingCompany} 
            onSuccess={handleClose} 
            isSuperAdmin={isSuperAdmin}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPrinterFormOpen} onOpenChange={setIsPrinterFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Nova Impressora para {selectedCompanyForPrinter?.name}</DialogTitle>
          </DialogHeader>
          <PrinterForm 
            onSuccess={handlePrinterClose} 
            isSuperAdmin={false} // Force false so it uses the selected company
            currentCompanyId={selectedCompanyForPrinter?.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
