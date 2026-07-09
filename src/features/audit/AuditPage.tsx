import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { AuditTable } from "./AuditTable";
import { AuditModule, AuditAction } from "@/types/audit";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download,
  Calendar,
  User as UserIcon,
  Box,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AuditPage: React.FC = () => {
  const { user } = useAuth();
  const [moduleFilter, setModuleFilter] = useState<AuditModule | undefined>();
  const [actionFilter, setActionFilter] = useState<AuditAction | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const { data: logs, isLoading } = useAuditLogs({
    companyId: isSuperAdmin ? undefined : user?.companyId,
    module: moduleFilter,
    action: actionFilter,
  });

  const filteredLogs = logs?.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Auditoria</h1>
          </div>
          <p className="text-slate-500 font-medium ml-12">
            Rastreamento completo de todas as ações no sistema.
          </p>
        </div>

        <div className="flex items-center gap-3 ml-12 md:ml-0">
          <Button variant="outline" className="h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-widest border-2 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-indigo-50/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Total de Eventos</p>
              <p className="text-2xl font-black text-slate-900">{filteredLogs.length}</p>
            </div>
          </CardContent>
        </Card>
        {/* Adicionar mais cards conforme necessário */}
      </div>

      {/* Filters Bar */}
      <Card className="border-2 border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filtros Avançados</span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input 
                placeholder="Buscar por usuário ou detalhe..." 
                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={moduleFilter} onValueChange={(v) => setModuleFilter(v as AuditModule)}>
              <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 rounded-xl font-medium">
                <Box className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Todos os Módulos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTH">Autenticação</SelectItem>
                <SelectItem value="COMPANIES">Empresas</SelectItem>
                <SelectItem value="PRINTERS">Impressoras</SelectItem>
                <SelectItem value="SERVICE_ORDERS">Ordens de Serviço</SelectItem>
                <SelectItem value="USERS">Usuários</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={(v) => setActionFilter(v as AuditAction)}>
              <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 rounded-xl font-medium">
                <Activity className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Todas as Ações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREATE">Criação</SelectItem>
                <SelectItem value="UPDATE">Edição</SelectItem>
                <SelectItem value="DELETE">Exclusão</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="STATUS_CHANGE">Troca de Status</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="ghost" 
              className="h-11 rounded-xl font-bold text-slate-500 hover:text-red-500"
              onClick={() => {
                setModuleFilter(undefined);
                setActionFilter(undefined);
                setSearchTerm("");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <AuditTable logs={filteredLogs} isLoading={isLoading} />
    </div>
  );
};
