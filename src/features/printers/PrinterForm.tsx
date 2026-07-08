import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { printerSchema, PrinterFormValues } from "../../schemas/printer.schema";
import { usePrinters } from "../../hooks/usePrinters";
import { useCompanies } from "../../hooks/useCompanies";
import { useAuth } from "../../contexts/AuthContext";
import { printerService } from "../../services/printer.service";
import { Printer } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

interface PrinterFormProps {
  initialData?: Printer | null;
  onSuccess: () => void;
  isSuperAdmin: boolean;
  currentCompanyId?: string;
}

export const PrinterForm: React.FC<PrinterFormProps> = ({ 
  initialData, 
  onSuccess, 
  isSuperAdmin,
  currentCompanyId 
}) => {
  const { createPrinter, updatePrinter } = usePrinters();
  const { companies } = useCompanies();
  const { user: authUser } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(printerSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      serialNumber: initialData.serialNumber,
      brand: initialData.brand,
      model: initialData.model,
      assetNumber: initialData.assetNumber || "",
      unit: initialData.unit || "",
      sector: initialData.sector || "",
      ip: initialData.ip || "",
      mac: initialData.mac || "",
      location: initialData.location || "",
      companyId: initialData.companyId,
      status: initialData.status,
      initialCounter: initialData.initialCounter,
      currentCounter: initialData.currentCounter,
      maintenanceLimit: initialData.maintenanceLimit || 0,
      observations: initialData.observations || "",
    } : {
      name: "",
      serialNumber: "",
      brand: "",
      model: "",
      assetNumber: "",
      unit: "",
      sector: "",
      ip: "",
      mac: "",
      location: "",
      companyId: currentCompanyId || "",
      status: 'ACTIVE',
      initialCounter: 0,
      currentCounter: 0,
      maintenanceLimit: 0,
      observations: "",
    },
  });

  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(initialData?.photoUrl || null);

  React.useEffect(() => {
    if (!initialData && currentCompanyId) {
      reset({
        name: "",
        serialNumber: "",
        brand: "",
        model: "",
        assetNumber: "",
        unit: "",
        sector: "",
        ip: "",
        mac: "",
        location: "",
        companyId: currentCompanyId,
        status: 'ACTIVE',
        initialCounter: 0,
        currentCounter: 0,
        maintenanceLimit: 0,
        observations: "",
      });
      setPhotoPreview(null);
    }
  }, [currentCompanyId, initialData, reset]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: any) => {
    try {
      let photoUrl = initialData?.photoUrl;

      const printerData = {
        ...data,
        createdBy: authUser?.id || "system",
        updatedBy: authUser?.id || "system",
      };

      if (initialData) {
        if (photoFile) {
          photoUrl = await printerService.uploadPhoto(data.companyId, initialData.id, photoFile);
        }
        await updatePrinter.mutateAsync({ 
          id: initialData.id, 
          data: { ...printerData, photoUrl } 
        });
      } else {
        const newPrinter = await createPrinter.mutateAsync(printerData);
        if (photoFile) {
          photoUrl = await printerService.uploadPhoto(data.companyId, newPrinter.id, photoFile);
          await updatePrinter.mutateAsync({ id: newPrinter.id, data: { photoUrl } });
        }
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Nome/Apelido</Label>
          <Input id="name" {...register("name")} placeholder="Ex: Recepção" className="h-9 text-sm" />
          {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="assetNumber" className="text-xs font-bold uppercase tracking-widest text-slate-500">Nº Patrimônio</Label>
          <Input id="assetNumber" {...register("assetNumber")} placeholder="Ex: PRT-001" className="h-9 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serialNumber" className="text-xs font-bold uppercase tracking-widest text-slate-500">Nº de Série</Label>
          <Input id="serialNumber" {...register("serialNumber")} className="h-9 text-sm" />
          {errors.serialNumber && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.serialNumber.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-xs font-bold uppercase tracking-widest text-slate-500">Marca</Label>
          <Input id="brand" {...register("brand")} placeholder="Ex: HP, Brother" className="h-9 text-sm" />
          {errors.brand && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.brand.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model" className="text-xs font-bold uppercase tracking-widest text-slate-500">Modelo</Label>
          <Input id="model" {...register("model")} placeholder="Ex: LaserJet Pro" className="h-9 text-sm" />
          {errors.model && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.model.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unit" className="text-xs font-bold uppercase tracking-widest text-slate-500">Unidade</Label>
          <Input id="unit" {...register("unit")} placeholder="Ex: Matriz" className="h-9 text-sm" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sector" className="text-xs font-bold uppercase tracking-widest text-slate-500">Setor</Label>
          <Input id="sector" {...register("sector")} placeholder="Ex: RH" className="h-9 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ip" className="text-xs font-bold uppercase tracking-widest text-slate-500">IP</Label>
          <Input id="ip" {...register("ip")} placeholder="0.0.0.0" className="h-9 text-sm" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mac" className="text-xs font-bold uppercase tracking-widest text-slate-500">MAC</Label>
          <Input id="mac" {...register("mac")} placeholder="00:00:00:00:00:00" className="h-9 text-sm" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-slate-500">Localização Detalhada</Label>
          <Input id="location" {...register("location")} placeholder="Mesa 01" className="h-9 text-sm" />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Foto do Equipamento</Label>
        <div className="flex items-center gap-4">
          {photoPreview && (
            <div className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          <Input type="file" accept="image/*" onChange={handlePhotoChange} className="h-9 text-sm flex-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initialCounter" className="text-xs font-bold uppercase tracking-widest text-slate-500">Contador Inicial</Label>
          <Input id="initialCounter" type="number" {...register("initialCounter")} className="h-9 text-sm" />
          {errors.initialCounter && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.initialCounter.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentCounter" className="text-xs font-bold uppercase tracking-widest text-slate-500">Contador Atual</Label>
          <Input id="currentCounter" type="number" {...register("currentCounter")} className="h-9 text-sm" />
          {errors.currentCounter && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.currentCounter.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maintenanceLimit" className="text-xs font-bold uppercase tracking-widest text-slate-500">Limite de Manutenção (Franquia)</Label>
        <Input id="maintenanceLimit" type="number" {...register("maintenanceLimit")} placeholder="Ex: 50000" className="h-9 text-sm" />
        <p className="text-[10px] text-slate-400 font-medium">Alerta de manutenção será exibido ao atingir este contador.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div className="space-y-2">
          <Label htmlFor="companyId" className="text-xs font-bold uppercase tracking-widest text-slate-500">Empresa</Label>
          {isSuperAdmin ? (
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
          ) : (
            <>
              <Input 
                value={companies.find(c => c.id === currentCompanyId)?.name || ""} 
                disabled 
                className="h-9 text-sm bg-slate-50" 
              />
              <input type="hidden" value={currentCompanyId} {...register("companyId")} />
            </>
          )}
          {errors.companyId && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.companyId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</Label>
          <select 
            id="status" 
            {...register("status")} 
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="ACTIVE">Ativa</option>
            <option value="INACTIVE">Inativa</option>
            <option value="MAINTENANCE">Em Manutenção</option>
            <option value="WAITING_PARTS">Aguardando Peças</option>
          </select>
          {errors.status && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.status.message}</p>}
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <Label htmlFor="observations" className="text-xs font-bold uppercase tracking-widest text-slate-500">Observações</Label>
        <Textarea id="observations" {...register("observations")} className="min-h-[80px] text-sm" />
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
        <Button type="submit" disabled={createPrinter.isPending || updatePrinter.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          {initialData ? "Salvar Alterações" : "Cadastrar Impressora"}
        </Button>
      </div>
    </form>
  );
};
