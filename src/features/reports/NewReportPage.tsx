import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Download, Table as TableIcon } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { ReportFilterForm } from "./ReportFilterForm";
import { ReportRequest } from "../../schemas/report.schema";
import { useReports } from "../../hooks/useReports";
import { usePrinters } from "../../hooks/usePrinters";
import { useServiceOrders } from "../../hooks/useServiceOrders";
import { Button } from "../../components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";

export const NewReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { generateReport, isGenerating } = useReports();
  const { printers } = usePrinters();
  const { orders } = useServiceOrders();
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ReportRequest | null>(null);

  const getFilteredData = (data: ReportRequest) => {
    let reportData: any[] = [];
    
    switch (data.type) {
      case 'PRINTER_HISTORY':
        const printer = printers.find(p => p.id === data.filters.printerId);
        reportData = printer ? [printer] : printers;
        break;
      case 'OS_PERIOD':
        reportData = orders.filter(o => {
          const date = new Date(o.openingDate?.seconds ? o.openingDate.toDate() : o.openingDate);
          const start = data.filters.startDate ? new Date(data.filters.startDate) : null;
          const end = data.filters.endDate ? new Date(data.filters.endDate) : null;
          
          if (start && date < start) return false;
          if (end && date > end) return false;
          return true;
        });
        break;
      case 'COSTS':
        reportData = orders.map(o => ({
          OS: o.number,
          Equipamento: o.printerId,
          Data: o.openingDate,
          Custo: o.totalCost,
          Status: o.status
        }));
        break;
      default:
        reportData = orders;
    }
    return reportData;
  };

  const handlePreview = (data: ReportRequest) => {
    const reportData = getFilteredData(data);
    setPreviewData(reportData);
    setCurrentRequest(data);
  };

  const handleGenerate = async () => {
    if (!currentRequest || !previewData) return;
    
    await generateReport({
      ...currentRequest,
      data: previewData
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/reports")}
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <PageHeader 
          title="Novo Relatório" 
          subtitle="Configure os filtros para gerar um novo documento"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
            <ReportFilterForm 
              onSubmit={(data) => handlePreview(data)} 
              isLoading={isGenerating} 
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          {previewData ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <TableIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 tracking-tight">Pré-visualização</h3>
                      <p className="text-xs text-slate-500">{previewData.length} registros encontrados</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Gerar {currentRequest?.format}
                  </Button>
                </div>

                <div className="border rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        {previewData.length > 0 && Object.keys(previewData[0]).slice(0, 4).map(key => (
                          <TableHead key={key} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(0, 10).map((row, i) => (
                        <TableRow key={i}>
                          {Object.values(row).slice(0, 4).map((val: any, j) => (
                            <TableCell key={j} className="text-sm text-slate-600">
                              {typeof val === 'object' ? JSON.stringify(val).slice(0, 20) : String(val)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {previewData.length > 10 && (
                  <p className="text-center text-xs text-slate-400 mt-4 italic">
                    Exibindo apenas os primeiros 10 registros na prévia.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Eye className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aguardando filtros</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-xs">
                Selecione o tipo de relatório e configure os filtros à esquerda para visualizar uma prévia dos dados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
