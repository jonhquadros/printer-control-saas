import React from "react";
import { Printer } from "../../types";
import { Card } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";

interface PrinterDataTabProps {
  printer: Printer;
}

export const PrinterDataTab: React.FC<PrinterDataTabProps> = ({ printer }) => {
  const statusColors = {
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    INACTIVE: "bg-slate-100 text-slate-800 border-slate-200",
    MAINTENANCE: "bg-amber-100 text-amber-800 border-amber-200",
    WAITING_PARTS: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels = {
    ACTIVE: "Ativa",
    INACTIVE: "Inativa",
    MAINTENANCE: "Manutenção",
    WAITING_PARTS: "Aguardando Peças",
  };

  const detailUrl = `${window.location.origin}/printers/${printer.id}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Informações Gerais</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Patrimônio</Label>
              <p className="text-sm font-medium text-slate-900">{printer.assetNumber || "---"}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nº de Série</Label>
              <p className="text-sm font-medium text-slate-900">{printer.serialNumber}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</Label>
              <div>
                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", statusColors[printer.status])}>
                  {statusLabels[printer.status]}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Marca</Label>
              <p className="text-sm font-medium text-slate-900">{printer.brand}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Modelo</Label>
              <p className="text-sm font-medium text-slate-900">{printer.model}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Localização</Label>
              <p className="text-sm font-medium text-slate-900">{printer.unit} - {printer.sector}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">IP</Label>
              <p className="text-sm font-mono font-medium text-slate-900">{printer.ip || "---"}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">MAC</Label>
              <p className="text-sm font-mono font-medium text-slate-900">{printer.mac || "---"}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Localização Detalhada</Label>
              <p className="text-sm font-medium text-slate-900">{printer.location || "---"}</p>
            </div>
          </div>

          {printer.observations && (
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Observações</Label>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{printer.observations}</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Contadores</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Contador Inicial</Label>
              <p className="text-2xl font-bold text-slate-900 mt-1">{printer.initialCounter.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Contador Atual</Label>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{printer.currentCounter.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6 flex flex-col items-center text-center">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Identificação QR Code</h4>
          <div className="p-3 bg-white border-2 border-slate-100 rounded-xl shadow-sm mb-4">
            <QRCodeSVG 
              value={detailUrl}
              size={160}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed px-4">
            Aponte a câmera para acessar o histórico e abrir Ordens de Serviço rapidamente.
          </p>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="aspect-square bg-slate-100 relative">
            {printer.photoUrl ? (
              <img src={printer.photoUrl} alt={printer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <p className="text-xs font-bold uppercase tracking-widest">Sem Foto</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-slate-100">
             <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Última Manutenção</h4>
             <p className="text-sm font-medium text-slate-900">
               {printer.lastMaintenanceDate ? new Date(printer.lastMaintenanceDate.seconds * 1000).toLocaleDateString('pt-BR') : "Nenhuma registrada"}
             </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
