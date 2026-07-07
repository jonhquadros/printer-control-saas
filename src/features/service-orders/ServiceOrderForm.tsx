import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceOrderSchema, ServiceOrderFormValues } from "../../schemas/service-order.schema";
import { useServiceOrders } from "../../hooks/useServiceOrders";
import { usePrinters } from "../../hooks/usePrinters";
import { useUsers } from "../../hooks/useUsers";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface ServiceOrderFormProps {
  onSuccess: () => void;
}

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ onSuccess }) => {
  const { createOrder } = useServiceOrders();
  const { printers } = usePrinters();
  const { users } = useUsers();

  const technicians = users.filter(u => u.role === 'TECHNICIAN' || u.role === 'ADMIN');

  const { register, handleSubmit, formState: { errors } } = useForm<ServiceOrderFormValues>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: {
      priority: 'NORMAL',
      category: 'CORRETIVA',
    },
  });

  const onSubmit = async (data: ServiceOrderFormValues) => {
    try {
      await createOrder.mutateAsync(data);
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="printerId" className="text-xs font-bold uppercase tracking-widest text-slate-500">Impressora</Label>
        <select 
          id="printerId" 
          {...register("printerId")} 
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecione...</option>
          {printers.map(p => (
            <option key={p.id} value={p.id}>{p.name} - {p.serialNumber}</option>
          ))}
        </select>
        {errors.printerId && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.printerId.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-xs font-bold uppercase tracking-widest text-slate-500">Prioridade</Label>
          <select 
            id="priority" 
            {...register("priority")} 
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="BAIXA">Baixa</option>
            <option value="NORMAL">Normal</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-slate-500">Categoria</Label>
          <select 
            id="category" 
            {...register("category")} 
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="CORRETIVA">Corretiva</option>
            <option value="PREVENTIVA">Preventiva</option>
            <option value="INSTALACAO">Instalação</option>
            <option value="RECOLHIMENTO">Recolhimento</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technicianId" className="text-xs font-bold uppercase tracking-widest text-slate-500">Atribuir a (Técnico)</Label>
        <select 
          id="technicianId" 
          {...register("technicianId")} 
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Não atribuído agora</option>
          {technicians.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem" className="text-xs font-bold uppercase tracking-widest text-slate-500">Problema Informado</Label>
        <textarea 
          id="problem" 
          {...register("problem")} 
          rows={3}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.problem && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.problem.message}</p>}
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" disabled={createOrder.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Abrir OS
        </Button>
      </div>
    </form>
  );
};
