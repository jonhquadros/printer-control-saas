import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportRequestSchema, ReportRequest } from "../../schemas/report.schema";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { usePrinters } from "../../hooks/usePrinters";
import { useUsers } from "../../hooks/useUsers";
import { 
  FileText, 
  Download, 
  Calendar, 
  Printer as PrinterIcon, 
  User as UserIcon,
  Filter
} from "lucide-react";

interface ReportFilterFormProps {
  onSubmit: (data: ReportRequest) => void;
  isLoading: boolean;
}

const REPORT_TYPES = [
  { id: 'PRINTER_HISTORY', label: 'Histórico por Impressora', description: 'Leituras, OS e custos de um equipamento' },
  { id: 'COMPANY_HISTORY', label: 'Histórico por Empresa', description: 'Visão consolidada de todos os equipamentos' },
  { id: 'OS_PERIOD', label: 'OS por Período', description: 'Listagem detalhada de Ordens de Serviço' },
  { id: 'COSTS', label: 'Relatório de Custos', description: 'Análise financeira de manutenção e peças' },
  { id: 'PARTS', label: 'Peças Utilizadas', description: 'Ranking e consumo de suprimentos' },
  { id: 'COUNTER_EVOLUTION', label: 'Evolução de Contadores', description: 'Crescimento do volume de impressão' },
  { id: 'PREVENTIVE', label: 'Manutenções Preventivas', description: 'Equipamentos próximos da revisão' },
  { id: 'SLA', label: 'SLA de Atendimento', description: 'Tempo médio de resposta por técnico' },
];

export const ReportFilterForm: React.FC<ReportFilterFormProps> = ({ onSubmit, isLoading }) => {
  const { printers } = usePrinters();
  const { users } = useUsers();
  const technicians = users.filter(u => u.role === 'TECHNICIAN' || u.role === 'ADMIN');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ReportRequest>({
    resolver: zodResolver(reportRequestSchema),
    defaultValues: {
      format: 'PDF',
      filters: {
        startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of month
        endDate: new Date().toISOString().split('T')[0],
      }
    }
  });

  const selectedType = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Select Type */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800 tracking-tight">1. Selecione o Tipo de Relatório</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {REPORT_TYPES.map((type) => (
              <label 
                key={type.id}
                className={`
                  relative flex items-start p-4 cursor-pointer rounded-xl border-2 transition-all
                  ${selectedType === type.id 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'}
                `}
              >
                <input 
                  type="radio" 
                  {...register("type")} 
                  value={type.id} 
                  className="sr-only"
                />
                <div className="flex-1">
                  <span className={`block font-bold text-sm ${selectedType === type.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {type.label}
                  </span>
                  <span className="block text-xs text-slate-500 mt-1">
                    {type.description}
                  </span>
                </div>
                {selectedType === type.id && (
                  <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </label>
            ))}
          </div>
          {errors.type && <p className="text-xs text-red-500 font-bold uppercase">{errors.type.message}</p>}
        </div>

        {/* Step 2: Filters & Options */}
        <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Filter className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-800 tracking-tight">2. Configurações e Filtros</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Nome do Relatório</Label>
              <Input 
                id="name" 
                {...register("name")} 
                placeholder="Ex: Relatório de OS - Junho 2024"
                className="bg-white"
              />
              {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Data Início</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input type="date" {...register("filters.startDate")} className="pl-10 bg-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Data Fim</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input type="date" {...register("filters.endDate")} className="pl-10 bg-white" />
                </div>
              </div>
            </div>

            {(selectedType === 'PRINTER_HISTORY' || selectedType === 'COUNTER_EVOLUTION') && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Impressora</Label>
                <div className="relative">
                  <PrinterIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400 z-10" />
                  <select 
                    {...register("filters.printerId")}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Todas as Impressoras</option>
                    {printers.map(p => (
                      <option key={p.id} value={p.id}>{p.brand} {p.model} - {p.serialNumber}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedType === 'SLA' && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Técnico</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400 z-10" />
                  <select 
                    {...register("filters.technicianId")}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Todos os Técnicos</option>
                    {technicians.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Formato de Saída</Label>
              <div className="grid grid-cols-3 gap-2">
                {['PDF', 'EXCEL', 'CSV'].map((format) => (
                  <label 
                    key={format}
                    className={`
                      flex items-center justify-center py-2 px-3 rounded-lg border-2 cursor-pointer transition-all text-xs font-bold
                      ${watch("format") === format 
                        ? 'border-indigo-600 bg-indigo-600 text-white' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
                    `}
                  >
                    <input type="radio" {...register("format")} value={format} className="sr-only" />
                    {format}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-100"
              disabled={isLoading}
            >
              <Download className="w-5 h-5 mr-2" />
              {isLoading ? "Gerando Relatório..." : "Gerar e Baixar Agora"}
            </Button>
            <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-medium">
              O relatório será registrado em seu histórico.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
