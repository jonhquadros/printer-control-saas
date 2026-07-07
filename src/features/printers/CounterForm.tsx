import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { counterSchema, CounterFormData } from "../../schemas/counter.schema";
import { useCounters } from "../../hooks/useCounters";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

interface CounterFormProps {
  printerId: string;
  onSuccess: () => void;
}

export const CounterForm: React.FC<CounterFormProps> = ({ printerId, onSuccess }) => {
  const { user } = useAuth();
  const { createCounter } = useCounters(printerId);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(counterSchema),
    defaultValues: {
      printerId,
      companyId: user?.companyId || "",
      technicianId: user?.id || "",
      technicianName: user?.name || "",
      origin: "MANUAL",
      date: new Date().toISOString().split('T')[0], // For the input type="date"
    },
  });

  const onSubmit = async (data: CounterFormData) => {
    await createCounter.mutateAsync({
      ...data,
      date: new Date(data.date), // Convert back to Date object for Firestore
      technicianId: user?.id || "unknown",
      technicianName: user?.name || "Desconhecido",
      createdBy: user?.id || "unknown",
      updatedBy: user?.id || "unknown",
      status: "ACTIVE",
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Data da Leitura</Label>
          <Input type="date" {...register("date")} className="h-9 text-sm" />
          {errors.date && <p className="text-[10px] text-red-500 font-bold">{errors.date.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Contador Atual</Label>
          <Input 
            type="number" 
            {...register("counter")} 
            placeholder="0" 
            className="h-9 text-sm font-mono"
          />
          {errors.counter && <p className="text-[10px] text-red-500 font-bold">{errors.counter.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Origem</Label>
        <select 
          {...register("origin")} 
          className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="MANUAL">Coleta Manual</option>
          <option value="SNMP">Leitura via Rede (SNMP)</option>
          <option value="API">Integração Externa (API)</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Observações</Label>
        <Textarea 
          {...register("observation")} 
          placeholder="Ex: Trocado toner junto com a leitura..." 
          className="text-sm min-h-[80px]"
        />
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button 
          type="submit" 
          disabled={createCounter.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {createCounter.isPending ? "Salvando..." : "Registrar Leitura"}
        </Button>
      </div>
    </form>
  );
};
