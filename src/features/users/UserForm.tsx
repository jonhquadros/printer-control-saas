import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormValues } from "../../schemas/user.schema";
import { useUsers } from "../../hooks/useUsers";
import { useCompanies } from "../../hooks/useCompanies";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { maskPhone } from "../../utils/masks";
import { toast } from "react-hot-toast";

interface UserFormProps {
  initialData?: User | null;
  onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess }) => {
  const { user: currentUser } = useAuth();
  const { createUser, updateUser } = useUsers();
  const { companies } = useCompanies();

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAdminOrClient = currentUser?.role === 'ADMIN' || currentUser?.role === 'CLIENT';

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone || "",
      role: initialData.role,
      status: initialData.status,
      companyId: initialData.companyId,
    } : {
      role: isAdminOrClient ? 'CLIENT' : 'TECHNICIAN',
      status: 'ACTIVE',
      companyId: currentUser?.companyId,
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isSuperAdmin && !data.companyId) {
        toast.error("Por favor, selecione uma empresa.");
        return;
      }

      if (!initialData && !data.password) {
        toast.error("Por favor, informe uma senha.");
        return;
      }

      if (initialData) {
        await updateUser.mutateAsync({ id: initialData.id, data });
        toast.success("Usuário atualizado!");
      } else {
        await createUser.mutateAsync(data);
        toast.success("Usuário criado com sucesso!");
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao processar usuário.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Nome Completo</Label>
        <Input id="name" {...register("name")} className="h-9 text-sm" />
        {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">E-mail</Label>
        <Input id="email" type="email" {...register("email")} className="h-9 text-sm" disabled={!!initialData} />
        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
      </div>

      {!initialData && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Senha de Acesso</Label>
          <Input id="password" type="password" {...register("password")} className="h-9 text-sm" />
          {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.password.message}</p>}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-500">Telefone</Label>
        <Input 
          id="phone" 
          {...register("phone")} 
          onChange={(e) => setValue("phone", maskPhone(e.target.value))}
          className="h-9 text-sm" 
        />
        {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.phone.message}</p>}
      </div>

      {isSuperAdmin && (
        <div className="space-y-2">
          <Label htmlFor="companyId" className="text-xs font-bold uppercase tracking-widest text-slate-500">Empresa</Label>
          <select 
            id="companyId" 
            {...register("companyId")} 
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione uma empresa</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
          {errors.companyId && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.companyId.message}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-slate-500">Perfil</Label>
          <select 
            id="role" 
            {...register("role")} 
            disabled={isAdminOrClient}
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
            <option value="ADMIN">Administrador</option>
            <option value="TECHNICIAN">Técnico</option>
            <option value="CLIENT">Cliente</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</Label>
          <select 
            id="status" 
            {...register("status")} 
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" disabled={createUser.isPending || updateUser.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {initialData ? "Salvar Alterações" : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
};
