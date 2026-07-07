import React, { useState } from "react";
import { ServiceOrder } from "../../types";
import { useServiceOrder } from "../../hooks/useServiceOrders";
import { usePrinter } from "../../hooks/usePrinters";
import { useUsers } from "../../hooks/useUsers";
import { format } from "date-fns";
import { Button } from "../../components/ui/button";

export const OSInfoTab: React.FC<{ order: ServiceOrder }> = ({ order }) => {
  const { updateOrder } = useServiceOrder(order.id);
  const { printer } = usePrinter(order.printerId);
  const { users } = useUsers();
  const technician = users.find(u => u.id === order.technicianId);

  const [diagnosis, setDiagnosis] = useState(order.diagnosis || "");
  const [technicalReport, setTechnicalReport] = useState(order.technicalReport || "");
  const [solution, setSolution] = useState(order.solution || "");

  const handleSaveInfo = () => {
    updateOrder.mutate({ diagnosis, technicalReport, solution });
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Dados do Equipamento</h3>
          {printer ? (
            <div className="space-y-1 text-sm text-slate-900">
              <p><strong>Nome:</strong> {printer.name}</p>
              <p><strong>NS:</strong> {printer.serialNumber}</p>
              <p><strong>Marca/Modelo:</strong> {printer.brand} {printer.model}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Impressora não encontrada</p>
          )}
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Detalhes da OS</h3>
          <div className="space-y-1 text-sm text-slate-900">
            <p><strong>Abertura:</strong> {(() => {
              const date = order.openingDate;
              if (!date) return "-";
              try {
                const d = date.seconds ? date.toDate() : new Date(date);
                if (isNaN(d.getTime())) return "-";
                return format(d, "dd/MM/yyyy HH:mm");
              } catch (e) {
                return "-";
              }
            })()}</p>
            <p><strong>Prioridade:</strong> {order.priority}</p>
            <p><strong>Categoria:</strong> {order.category}</p>
            <p><strong>Técnico:</strong> {technician ? technician.name : "Não atribuído"}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Problema Informado</h3>
        <div className="p-3 bg-slate-50 rounded border text-sm text-slate-800 whitespace-pre-wrap">
          {order.problem}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preenchimento Técnico</h3>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Diagnóstico</label>
          <textarea 
            className="w-full p-2 border rounded-md text-sm" 
            rows={3} 
            value={diagnosis} 
            onChange={e => setDiagnosis(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Parecer Técnico</label>
          <textarea 
            className="w-full p-2 border rounded-md text-sm" 
            rows={3} 
            value={technicalReport} 
            onChange={e => setTechnicalReport(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Solução</label>
          <textarea 
            className="w-full p-2 border rounded-md text-sm" 
            rows={3} 
            value={solution} 
            onChange={e => setSolution(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveInfo} disabled={updateOrder.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Salvar Informações
          </Button>
        </div>
      </div>
    </div>
  );
};
