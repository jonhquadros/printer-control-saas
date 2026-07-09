import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { settingsService } from '@/services/settings.service';
import { 
  Rocket, 
  Building2, 
  UserPlus, 
  Printer, 
  MessageSquare, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";

const steps = [
  { id: 1, title: 'Bem-vindo', icon: Rocket, description: 'Vamos configurar sua empresa.' },
  { id: 2, title: 'Dados da Empresa', icon: Building2, description: 'Confirme os detalhes da sua conta.' },
  { id: 3, title: 'Primeiro Equipamento', icon: Printer, description: 'Cadastre sua primeira impressora.' },
  { id: 4, title: 'Comunicação', icon: MessageSquare, description: 'Ative o WhatsApp (opcional).' },
  { id: 5, title: 'Concluído!', icon: CheckCircle2, description: 'Sua plataforma está pronta.' },
];

export const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  const handleFinish = async () => {
    setLoading(true);
    try {
      await settingsService.initializeCompany(user?.companyId || '', {
        name: 'Starter',
        maxPrinters: 50,
        maxUsers: 3
      });
      toast.success("Configuração concluída com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Erro ao finalizar configuração.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Passo {currentStep} de {steps.length}</p>
            <h1 className="text-2xl font-black tracking-tight">{steps[currentStep-1].title}</h1>
            <p className="text-slate-400 text-sm">{steps[currentStep-1].description}</p>
          </div>
          <Progress value={progress} className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-none overflow-hidden [&>div]:bg-indigo-500" />
        </div>

        {/* Content */}
        <div className="flex-1 p-10 flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              {currentStep === 1 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="bg-indigo-100 p-6 rounded-[2rem]">
                    <Rocket className="w-12 h-12 text-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Olá, {user?.name}!</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      Estamos felizes em ter você aqui. Vamos levar apenas 2 minutos para deixar tudo pronto para o seu outsourcing.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Fantasia</Label>
                      <Input placeholder="Sua Empresa Ltda" className="h-12 rounded-xl" defaultValue={user?.companyName} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Segmento Principal</Label>
                      <select className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none">
                        <option>Outsourcing de Impressão</option>
                        <option>Assistência Técnica</option>
                        <option>Locação de Equipamentos</option>
                        <option>TI Corporativo</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                   <div className="bg-emerald-100 p-5 rounded-2xl">
                     <Printer className="w-10 h-10 text-emerald-600" />
                   </div>
                   <p className="text-slate-500 text-center max-w-sm">
                     O sistema funciona melhor quando você tem equipamentos cadastrados. Você pode cadastrar sua primeira impressora agora ou pular este passo.
                   </p>
                   <Button variant="outline" className="rounded-xl font-bold border-2 h-11 px-8">Cadastrar Depois</Button>
                </div>
              )}

              {currentStep === 5 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="bg-emerald-100 p-6 rounded-[2rem]">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Tudo Pronto!</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      Sua conta foi configurada com sucesso. Agora você pode gerenciar suas impressoras e ordens de serviço.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <Button
              variant="ghost"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="rounded-xl font-bold text-slate-400 hover:text-slate-900"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-slate-200"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-10 font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 transition-all"
              >
                Começar agora
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${step.id === currentStep ? 'w-8 bg-indigo-600' : 'bg-slate-300'}`} 
          />
        ))}
      </div>
    </div>
  );
};
