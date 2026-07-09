import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { companySettingsSchema, CompanySettingsFormValues } from '@/types/settings';
import { 
  Settings, 
  Save, 
  MessageSquare, 
  Bot, 
  Bell, 
  History,
  Shield,
  Building2,
  Gauge
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings, isUpdating } = useSettings(user?.companyId);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      maintenanceThresholdPages: 5000,
      maintenanceThresholdDays: 180,
      whatsappEnabled: false,
      aiEnabled: false,
      notificationPreferences: {
        osCreated: true,
        osAssigned: true,
        osFinished: true,
        maintenanceDue: true,
      }
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        maintenanceThresholdPages: settings.maintenanceThresholdPages,
        maintenanceThresholdDays: settings.maintenanceThresholdDays,
        whatsappEnabled: settings.whatsappEnabled,
        whatsappToken: settings.whatsappToken,
        aiEnabled: settings.aiEnabled,
        notificationPreferences: settings.notificationPreferences,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: CompanySettingsFormValues) => {
    try {
      await updateSettings(data);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg">
               <Settings className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-3xl font-black tracking-tight text-slate-900">Configurações</h1>
          </div>
          <p className="text-slate-500 font-medium ml-12">Gerencie as preferências da sua empresa e do sistema.</p>
        </div>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          disabled={isUpdating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-xl h-12 inline-flex border border-slate-200">
          <TabsTrigger value="general" className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Gauge className="w-4 h-4 mr-2" />
            Operacional
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Bot className="w-4 h-4 mr-2" />
            Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-slate-100 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-black text-slate-900">Manutenção Preventiva</CardTitle>
                <CardDescription>Defina os gatilhos para alertas de manutenção.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Franquia de Páginas</Label>
                  <Input 
                    type="number" 
                    {...register("maintenanceThresholdPages", { valueAsNumber: true })} 
                    className="h-11 rounded-xl bg-slate-50/50"
                  />
                  <p className="text-[10px] text-slate-400">Notificar quando a impressora imprimir X páginas desde a última manutenção.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Intervalo de Dias</Label>
                  <Input 
                    type="number" 
                    {...register("maintenanceThresholdDays", { valueAsNumber: true })} 
                    className="h-11 rounded-xl bg-slate-50/50"
                  />
                  <p className="text-[10px] text-slate-400">Notificar a cada X dias após a última manutenção.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-100 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-black text-slate-900">Informações da Conta</CardTitle>
                <CardDescription>Dados do seu plano e empresa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plano Atual</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {settings?.plan?.name || 'Starter'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impressoras</span>
                      <p className="text-sm font-bold text-slate-900">{settings?.plan?.maxPrinters || 50}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuários</span>
                      <p className="text-sm font-bold text-slate-900">{settings?.plan?.maxUsers || 3}</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full h-11 rounded-xl font-bold border-2 text-indigo-600 hover:text-indigo-700">
                  Fazer Upgrade do Plano
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="animate-in slide-in-from-bottom-2 duration-300">
           <Card className="border-2 border-slate-100 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-black text-slate-900">Alertas do Sistema</CardTitle>
                <CardDescription>Escolha quais eventos geram notificações no sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-0 pb-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Abertura de Ordem de Serviço</p>
                    <p className="text-xs text-slate-500">Notificar quando uma nova OS for criada.</p>
                  </div>
                  <Switch 
                    checked={watch("notificationPreferences.osCreated")}
                    onCheckedChange={(val) => setValue("notificationPreferences.osCreated", val)}
                  />
                </div>
                <div className="flex items-center justify-between py-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Atribuição de Técnico</p>
                    <p className="text-xs text-slate-500">Notificar o técnico quando uma OS for atribuída a ele.</p>
                  </div>
                  <Switch 
                    checked={watch("notificationPreferences.osAssigned")}
                    onCheckedChange={(val) => setValue("notificationPreferences.osAssigned", val)}
                  />
                </div>
                <div className="flex items-center justify-between py-6">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Finalização de OS</p>
                    <p className="text-xs text-slate-500">Notificar quando uma OS for concluída pelo técnico.</p>
                  </div>
                  <Switch 
                    checked={watch("notificationPreferences.osFinished")}
                    onCheckedChange={(val) => setValue("notificationPreferences.osFinished", val)}
                  />
                </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="bg-emerald-50/50 p-6 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-emerald-100 p-3 rounded-2xl">
                    <MessageSquare className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900">WhatsApp Business API</h3>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Ativo e Integrado</p>
                 </div>
              </div>
              <Switch 
                checked={watch("whatsappEnabled")}
                onCheckedChange={(val) => setValue("whatsappEnabled", val)}
              />
            </div>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Token da API</Label>
                  <Input 
                    type="password" 
                    {...register("whatsappToken")} 
                    className="h-11 rounded-xl bg-slate-50/50 font-mono"
                    placeholder="WBA_TOKEN_..."
                  />
                  <p className="text-[10px] text-slate-400">Seu token de acesso para envio de mensagens automáticas.</p>
               </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="bg-indigo-50/50 p-6 border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-indigo-100 p-3 rounded-2xl">
                    <Bot className="w-6 h-6 text-indigo-600" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900">Inteligência Artificial</h3>
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Gemini 1.5 Flash</p>
                 </div>
              </div>
              <Switch 
                checked={watch("aiEnabled")}
                onCheckedChange={(val) => setValue("aiEnabled", val)}
              />
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                A IA auxilia no diagnóstico técnico, sugestão de peças e previsão de manutenção preventiva baseada no histórico de uso.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
