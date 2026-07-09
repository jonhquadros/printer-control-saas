import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partSchema, PartFormValues } from "../../../schemas/financial.schema";
import { useParts } from "../../../hooks/useParts";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "react-hot-toast";

interface PartFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export const PartForm: React.FC<PartFormProps> = ({ initialData, onSuccess }) => {
  const { createPart, updatePart } = useParts();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PartFormValues>({
    resolver: zodResolver(partSchema),
    defaultValues: initialData || {
      code: "",
      name: "",
      description: "",
      unitCost: 0,
      stock: 0,
      minStock: 0
    }
  });

  const onSubmit = async (data: PartFormValues) => {
    try {
      if (initialData) {
        await updatePart.mutateAsync({ id: initialData.id, data });
        toast.success("Peça atualizada com sucesso!");
      } else {
        await createPart.mutateAsync(data);
        toast.success("Peça cadastrada com sucesso!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Erro ao salvar peça.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code" className="text-xs font-bold uppercase tracking-wider text-slate-500">Código</Label>
          <Input id="code" {...register("code")} className="h-10" />
          {errors.code && <p className="text-[10px] text-red-500 font-medium">{errors.code.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nome</Label>
          <Input id="name" {...register("name")} className="h-10" />
          {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500">Descrição</Label>
        <Textarea id="description" {...register("description")} rows={2} className="resize-none" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitCost" className="text-xs font-bold uppercase tracking-wider text-slate-500">Custo Unit.</Label>
          <Input id="unitCost" type="number" step="0.01" {...register("unitCost", { valueAsNumber: true })} className="h-10" />
          {errors.unitCost && <p className="text-[10px] text-red-500 font-medium">{errors.unitCost.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-slate-500">Estoque</Label>
          <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} className="h-10" />
          {errors.stock && <p className="text-[10px] text-red-500 font-medium">{errors.stock.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStock" className="text-xs font-bold uppercase tracking-wider text-slate-500">Mínimo</Label>
          <Input id="minStock" type="number" {...register("minStock", { valueAsNumber: true })} className="h-10" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
        <Button type="button" variant="ghost" onClick={onSuccess} className="text-xs">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-10 px-6">
          {isSubmitting ? "Salvando..." : "Salvar Peça"}
        </Button>
      </div>
    </form>
  );
};
