import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { whatsappConfigSchema, WhatsAppConfigInput } from "../../schemas/whatsapp.schema";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { WhatsAppConfig, WhatsAppProvider } from "../../types";
import { 
  MessageSquare, 
  Settings, 
  Key, 
  Globe, 
  Phone, 
  FileJson,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Send
} from "lucide-react";
import { Switch } from "../../components/ui/switch";

interface WhatsAppConfigFormProps {
  initialData?: WhatsAppConfig | null;
  onSave: (data: WhatsAppConfigInput) => void;
  isLoading: boolean;
}

const PROVIDERS: { id: WhatsAppProvider, name: string, icon: any, color: string }[] = [
  { id: 'EVOLUTION', name: 'Evolution API', icon: Zap, color: 'text-amber-500' },
  { id: 'META', name: 'Meta Cloud API', icon: ShieldCheck, color: 'text-indigo-500' },
  { id: 'TWILIO', name: 'Twilio', icon: Send, color: 'text-red-500' },
];

export const WhatsAppConfigForm: React.FC<WhatsAppConfigFormProps> = ({ initialData, onSave, isLoading }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<WhatsAppConfigInput>({
    resolver: zodResolver(whatsappConfigSchema),
    defaultValues: initialData || {
      provider: 'EVOLUTION',
      isActive: true,
      templates: {
        OS_OPENED: "Olá {{clientName}}, sua OS #{{osNumber}} foi aberta para a impressora {{printerModel}}.",
        TECHNICIAN_ON_WAY: "O técnico {{technicianName}} está a caminho para realizar o atendimento da OS #{{osNumber}}.",
        OS_COMPLETED: "Atendimento finalizado! Segue em anexo o relatório técnico da OS #{{osNumber}}."
      }
    }
  });

  const selectedProvider = watch("provider");
  const isActive = watch("isActive");

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-8">
      <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Status do Módulo</h3>
            <p className="text-xs text-slate-500">Ative ou desative o envio de mensagens automáticas</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
            {isActive ? 'Ativo' : 'Inativo'}
          </span>
          <Switch 
            checked={isActive} 
            onCheckedChange={(val) => setValue("isActive", val)} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROVIDERS.map((provider) => (
          <label 
            key={provider.id}
            className={`
              relative flex flex-col items-center p-6 cursor-pointer rounded-2xl border-2 transition-all
              ${selectedProvider === provider.id 
                ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                : 'border-slate-100 hover:border-slate-200 bg-white'}
            `}
          >
            <input 
              type="radio" 
              {...register("provider")} 
              value={provider.id} 
              className="sr-only"
            />
            <provider.icon className={`w-8 h-8 mb-3 ${provider.color}`} />
            <span className={`font-bold text-sm ${selectedProvider === provider.id ? 'text-indigo-900' : 'text-slate-700'}`}>
              {provider.name}
            </span>
            {selectedProvider === provider.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </label>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800">Credenciais da API</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedProvider === 'EVOLUTION' && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">URL da API</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input {...register("apiUrl")} placeholder="https://api.evolution.com" className="pl-10" />
                </div>
                {errors.apiUrl && <p className="text-xs text-red-500">{errors.apiUrl.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nome da Instância</Label>
                <div className="relative">
                  <FileJson className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input {...register("instanceName")} placeholder="Empresa_01" className="pl-10" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Chave de API / Token</Label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input type="password" {...register("apiKey")} placeholder="••••••••••••••••" className="pl-10" />
            </div>
            {errors.apiKey && <p className="text-xs text-red-500">{errors.apiKey.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Telefone do Remetente</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input {...register("phoneNumber")} placeholder="+55 11 99999-9999" className="pl-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <FileJson className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800">Templates de Mensagens</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Abertura de OS</Label>
            <textarea 
              {...register("templates.OS_OPENED")}
              className="w-full min-h-[80px] p-4 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Técnico a Caminho</Label>
            <textarea 
              {...register("templates.TECHNICIAN_ON_WAY")}
              className="w-full min-h-[80px] p-4 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Conclusão de OS</Label>
            <textarea 
              {...register("templates.OS_COMPLETED")}
              className="w-full min-h-[80px] p-4 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-widest">Variáveis Disponíveis</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Use <code className="bg-white px-1 rounded">{"{{clientName}}"}</code>, 
              <code className="bg-white px-1 rounded">{"{{osNumber}}"}</code>, 
              <code className="bg-white px-1 rounded">{"{{printerModel}}"}</code>, 
              <code className="bg-white px-1 rounded">{"{{technicianName}}"}</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-12 rounded-xl shadow-lg shadow-indigo-100"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </form>
  );
};
