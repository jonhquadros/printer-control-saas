import React, { useState } from "react";
import { Plus, Users as UsersIcon, ShieldAlert } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../contexts/AuthContext";
import { DataTable } from "../../components/tables/DataTable";
import { Button } from "../../components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../types";
import { format } from "date-fns";
import { UserForm } from "./UserForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

export const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const { users, isLoading, deleteUser } = useUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const canInvite = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'CLIENT';

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente remover este usuário?")) {
      await deleteUser.mutateAsync(id);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Usuário",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 shrink-0">
            {row.original.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm truncate">{row.original.name || "Sem Nome"}</p>
            <p className="text-[10px] text-slate-500 truncate">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Perfil",
      cell: ({ row }) => {
        const role = row.original.role;
        const labels: Record<string, string> = {
          SUPER_ADMIN: "Super Admin",
          ADMIN: "Administrador",
          TECHNICIAN: "Técnico",
          CLIENT: "Cliente"
        };
        const colors: Record<string, string> = {
          SUPER_ADMIN: "bg-purple-100 text-purple-700",
          ADMIN: "bg-indigo-100 text-indigo-700",
          TECHNICIAN: "bg-blue-100 text-blue-700",
          CLIENT: "bg-slate-100 text-slate-700"
        };
        return (
          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${colors[role]}`}>
            {labels[role]}
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
          INACTIVE: "bg-red-100 text-red-700",
        };
        return (
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${colors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Último Acesso",
      cell: ({ row }) => {
        const date = row.original.lastLogin as any;
        if (!date) return "Nunca";
        try {
          const d = date instanceof Date ? date : (date.seconds ? date.toDate() : new Date(date));
          if (isNaN(d.getTime())) return "Nunca";
          return <span className="text-xs text-slate-500 font-medium">{format(d, "dd/MM/yyyy HH:mm")}</span>;
        } catch (e) {
          return "Nunca";
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)} className="text-xs h-8">
              Editar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(row.original.id)} 
              className="h-8 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
            >
              Excluir
            </Button>
          </div>
        )
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-slate-500">Carregando...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-indigo-600" />
            Usuários
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie os usuários e permissões da empresa.
          </p>
        </div>

        {canInvite && (
          <Button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200/50 transition-all active:scale-95 flex items-center gap-2 h-10 px-4 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold text-sm">Criar Usuário</span>
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={users} searchKey="name" />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuário" : "Convidar Novo Usuário"}</DialogTitle>
          </DialogHeader>
          <UserForm 
            initialData={editingUser} 
            onSuccess={handleClose} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
