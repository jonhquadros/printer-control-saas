import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AuditLog } from "@/types/audit";
import { Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditTableProps {
  logs: AuditLog[];
  isLoading: boolean;
}

export const AuditTable: React.FC<AuditTableProps> = ({ logs, isLoading }) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      case 'LOGIN': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">Carregando registros...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Search className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Nenhum log encontrado</h3>
        <p className="text-sm text-slate-500 max-w-xs mt-1">
          Não existem registros de auditoria para os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[180px] text-xs font-bold uppercase tracking-wider">Data/Hora</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Usuário</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Módulo</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Ação</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Detalhes</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-slate-50/30 transition-colors">
              <TableCell className="text-sm text-slate-600 font-medium">
                {format(log.timestamp, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight">{log.userName}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{log.userEmail}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-slate-50 text-[10px] font-bold uppercase tracking-tight">
                  {log.module}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`text-[10px] font-bold uppercase tracking-tight shadow-none border ${getActionColor(log.action)}`}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <p className="text-sm text-slate-600 truncate">{log.details}</p>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                  <Info className="h-4 w-4 text-slate-400" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
