import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormValues } from "../../schemas/user.schema";
import { useUsers } from "../../hooks/useUsers";
import { User } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { maskPhone } from "../../utils/masks";

interface UserFormProps {
  initialData?: User | null;
  onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess }) => {
  const { inviteUser, updateUser } = useUsers();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      role: initialData.role,
      status: initialData.status,
    } : {
      role: 'TECHNICIAN',
      status: 'ACTIVE',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (initialData) {
        await updateUser.mutateAsync({ id: initialData.id, data });
      } else {
        await inviteUser.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
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
        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">E-mail (Convite)</Label>
        <Input id="email" type="email" {...register("email")} className="h-9 text-sm" disabled={!!initialData} />
        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
      </div>
      
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-slate-500">Perfil</Label>
          <select 
            id="role" 
            {...register("role")} 
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="TECHNICIAN">Técnico</option>
            <option value="ADMIN">Administrador</option>
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
        <Button type="submit" disabled={inviteUser.isPending || updateUser.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {initialData ? "Salvar Alterações" : "Enviar Convite"}
        </Button>
      </div>
    </form>
  );
};
