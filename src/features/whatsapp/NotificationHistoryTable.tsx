import React from "react";
import { useNotificationHistory } from "../../hooks/useWhatsApp";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageCircle,
  ExternalLink,
  Search
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";

export const NotificationHistoryTable: React.FC = () => {
  const { logs, isLoading } = useNotificationHistory();
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredLogs = logs.filter(log => 
    log.recipient.includes(searchTerm) || 
    log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-center text-slate-500">Carregando histórico...</div>;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por telefone, evento ou mensagem..." 
            className="pl-10 bg-white border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-6">Data / Hora</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Destinatário</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Evento</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mensagem</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right pr-6">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-slate-400">
                Nenhum log de notificação encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filteredLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-6 font-medium text-slate-600 text-sm">
                  {format(log.createdAt?.seconds ? log.createdAt.toDate() : new Date(log.createdAt), "dd/MM HH:mm")}
                </TableCell>
                <TableCell className="text-slate-600 text-sm font-bold">
                  {log.recipient}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-slate-50">
                    {log.event.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-xs text-slate-500">
                  {log.message}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {log.status === 'SENT' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : log.status === 'FAILED' ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      log.status === 'SENT' ? 'text-emerald-600' : 
                      log.status === 'FAILED' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {log.status === 'SENT' ? 'Enviado' : 
                       log.status === 'FAILED' ? 'Falhou' : 'Pendente'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  {log.orderId && (
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
