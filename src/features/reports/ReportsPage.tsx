import React from "react";
import { FileText, Plus, Download, Calendar, ExternalLink, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/ui/button";
import { useReports } from "../../hooks/useReports";
import { format } from "date-fns";
import { Badge } from "../../components/ui/badge";

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { reports, isLoading } = useReports();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Relatórios" 
          subtitle="Gere e visualize relatórios de desempenho e custos"
        />
        <Button 
          onClick={() => navigate("/reports/new")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState 
          icon={FileText}
          title="Nenhum relatório gerado"
          description="Clique no botão acima para configurar e gerar seu primeiro relatório."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div 
              key={report.id}
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${
                  report.format === 'PDF' ? 'bg-red-50' : 'bg-emerald-50'
                }`}>
                  <FileText className={`w-6 h-6 ${
                    report.format === 'PDF' ? 'text-red-600' : 'text-emerald-600'
                  }`} />
                </div>
                <Badge variant={
                  report.status === 'COMPLETED' ? 'success' : 
                  report.status === 'PROCESSING' ? 'warning' : 'destructive'
                }>
                  {report.status === 'COMPLETED' ? 'Concluído' : 
                   report.status === 'PROCESSING' ? 'Processando' : 'Falhou'}
                </Badge>
              </div>

              <h3 className="font-bold text-slate-800 line-clamp-1 mb-1">{report.name}</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">
                {report.type.replace('_', ' ')} • {report.format}
              </p>

              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {(() => {
                    const date = report.createdAt?.seconds ? report.createdAt.toDate() : new Date(report.createdAt);
                    return isNaN(date.getTime()) ? '-' : format(date, 'dd/MM/yyyy');
                  })()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {(() => {
                    const date = report.createdAt?.seconds ? report.createdAt.toDate() : new Date(report.createdAt);
                    return isNaN(date.getTime()) ? '-' : format(date, 'HH:mm');
                  })()}
                </div>
              </div>

              {report.status === 'COMPLETED' && report.fileUrl ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl h-9 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100"
                    render={
                      <a href={report.fileUrl} download={`${report.name}.${report.format.toLowerCase()}`}>
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Baixar
                      </a>
                    }
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-9 w-9 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    render={
                      <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    }
                  />
                </div>
              ) : report.status === 'FAILED' ? (
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-xl text-red-600 text-[10px] font-bold uppercase">
                  <AlertCircle className="w-4 h-4" />
                  Erro ao gerar arquivo
                </div>
              ) : (
                <div className="h-9 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Processando...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
