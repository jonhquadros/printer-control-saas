import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, CompanyFormValues } from "../../schemas/company.schema";
import { useCompanies } from "../../hooks/useCompanies";
import { Company } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { maskCNPJ, maskPhone, maskCEP } from "../../utils/masks";

interface CompanyFormProps {
  initialData?: Company | null;
  onSuccess: () => void;
  isSuperAdmin: boolean;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ initialData, onSuccess, isSuperAdmin }) => {
  const { createCompany, updateCompany } = useCompanies();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData ? {
      name: initialData.name,
      cnpj: initialData.cnpj,
      email: initialData.email,
      phone: initialData.phone,
      address: initialData.address,
      city: initialData.city,
      state: initialData.state,
      plan: initialData.plan,
      status: initialData.status,
    } : {
      plan: 'STARTER',
      status: 'ACTIVE',
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      if (initialData) {
        await updateCompany.mutateAsync({ id: initialData.id, data, logoFile: logoFile || undefined });
      } else {
        await createCompany.mutateAsync({ data, logoFile: logoFile || undefined });
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Razão Social</Label>
          <Input id="name" {...register("name")} className="h-9 text-sm" />
          {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj" className="text-xs font-bold uppercase tracking-widest text-slate-500">CNPJ</Label>
          <Input 
            id="cnpj" 
            {...register("cnpj")} 
            onChange={(e) => setValue("cnpj", maskCNPJ(e.target.value))}
            className="h-9 text-sm" 
          />
          {errors.cnpj && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.cnpj.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">E-mail</Label>
          <Input id="email" type="email" {...register("email")} className="h-9 text-sm" />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-xs font-bold uppercase tracking-widest text-slate-500">Endereço</Label>
        <Input id="address" {...register("address")} className="h-9 text-sm" />
        {errors.address && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-slate-500">Cidade</Label>
          <Input id="city" {...register("city")} className="h-9 text-sm" />
          {errors.city && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-xs font-bold uppercase tracking-widest text-slate-500">UF</Label>
          <Input id="state" {...register("state")} maxLength={2} className="h-9 text-sm uppercase" />
          {errors.state && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.state.message}</p>}
        </div>
      </div>

      {isSuperAdmin && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-2">
            <Label htmlFor="plan" className="text-xs font-bold uppercase tracking-widest text-slate-500">Plano</Label>
            <select 
              id="plan" 
              {...register("plan")} 
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="STARTER">Starter</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ENTERPRISE">Enterprise</option>
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
              <option value="BLOCKED">Bloqueado</option>
            </select>
          </div>
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <Label htmlFor="logo" className="text-xs font-bold uppercase tracking-widest text-slate-500">Logotipo</Label>
        <Input 
          id="logo" 
          type="file" 
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          className="h-9 text-sm file:bg-slate-100 file:text-slate-700 file:border-0 file:mr-4 file:px-3 file:py-1 file:rounded file:text-xs file:font-medium hover:file:bg-slate-200" 
        />
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" disabled={createCompany.isPending || updateCompany.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {initialData ? "Salvar Alterações" : "Cadastrar Empresa"}
        </Button>
      </div>
    </form>
  );
};
