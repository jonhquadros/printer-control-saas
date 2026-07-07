import React from "react";
import { ServiceOrder, OSPart, Printer } from "../../types";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";

interface OSReportPDFProps {
  order: ServiceOrder;
  printer?: Printer;
  companyName: string;
}

export const OSReportPDF: React.FC<OSReportPDFProps> = ({ order, printer, companyName }) => {
  const formatDate = (date: any) => {
    if (!date) return "-";
    try {
      const d = date.seconds ? date.toDate() : new Date(date);
      return format(d, "dd/MM/yyyy HH:mm");
    } catch (e) {
      return "-";
    }
  };

  return (
    <div id="os-report-print" className="p-8 bg-white text-slate-900 w-[210mm] min-h-[297mm] mx-auto font-sans" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 pb-6 mb-8" style={{ borderBottomColor: '#4f46e5' }}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}>
            PC
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase" style={{ color: '#0f172a' }}>Relatório Técnico</h1>
            <p className="font-medium" style={{ color: '#64748b' }}>PrinterControl SaaS - {companyName}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#f1f5f9' }}>
            <span className="text-xs font-bold uppercase block" style={{ color: '#64748b' }}>Número da OS</span>
            <span className="text-xl font-bold" style={{ color: '#4f46e5' }}>#{String(order.number).padStart(5, '0')}</span>
          </div>
          <p className="text-[10px] mt-1 uppercase tracking-widest font-bold" style={{ color: '#94a3b8' }}>Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Status</span>
            <p className="text-sm font-bold" style={{ color: '#4338ca' }}>{order.status.replace('_', ' ')}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Prioridade</span>
            <p className="text-sm font-bold" style={{ color: '#0f172a' }}>{order.priority}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Abertura</span>
            <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{formatDate(order.openingDate)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Conclusão</span>
            <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{formatDate(order.completionDate)}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="p-2 border rounded-lg" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
            <QRCodeSVG value={`https://printercontrol.saas/os/${order.id}`} size={80} />
          </div>
        </div>
      </div>

      {/* Printer Info */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest p-2 rounded mb-4 border-l-4" style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderLeftColor: '#4f46e5' }}>Dados do Equipamento</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>Marca/Modelo</span>
            <p className="text-sm font-bold" style={{ color: '#0f172a' }}>{printer?.brand} {printer?.model}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>Nº de Série</span>
            <p className="text-sm font-mono font-bold" style={{ color: '#334155' }}>{printer?.serialNumber}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>Patrimônio</span>
            <p className="text-sm font-bold" style={{ color: '#0f172a' }}>{printer?.assetNumber || '-'}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>Localização</span>
            <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{printer?.unit} - {printer?.sector}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>Contador na OS</span>
            <p className="text-sm font-bold" style={{ color: '#4f46e5' }}>{order.registeredCounter || '-'}</p>
          </div>
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-widest p-2 rounded border-l-4" style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderLeftColor: '#4f46e5' }}>Descrição do Problema</h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#334155' }}>{order.problem}</p>
        </div>
        {order.technicalReport && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest p-2 rounded border-l-4" style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderLeftColor: '#4f46e5' }}>Parecer Técnico</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#334155' }}>{order.technicalReport}</p>
          </div>
        )}
      </div>

      {/* Parts */}
      {order.parts && order.parts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest p-2 rounded mb-4 border-l-4" style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderLeftColor: '#4f46e5' }}>Peças Substituídas</h3>
          <table className="w-full text-sm">
            <thead className="border-b" style={{ backgroundColor: '#f8fafc', borderBottomColor: '#e2e8f0' }}>
              <tr>
                <th className="px-4 py-2 text-left text-[10px] uppercase font-bold" style={{ color: '#64748b' }}>Descrição</th>
                <th className="px-4 py-2 text-center text-[10px] uppercase font-bold" style={{ color: '#64748b' }}>Qtd</th>
              </tr>
            </thead>
            <tbody>
              {order.parts.map((p: OSPart) => (
                <tr key={p.id} className="border-b last:border-0" style={{ borderBottomColor: '#f1f5f9' }}>
                  <td className="px-4 py-2 font-medium" style={{ color: '#0f172a' }}>{p.name}</td>
                  <td className="px-4 py-2 text-center" style={{ color: '#0f172a' }}>{p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Photos */}
      {order.photosUrls && order.photosUrls.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest p-2 rounded mb-4 border-l-4" style={{ backgroundColor: '#f8fafc', color: '#0f172a', borderLeftColor: '#4f46e5' }}>Evidências Fotográficas</h3>
          <div className="grid grid-cols-3 gap-4">
            {order.photosUrls.map((url, i) => (
              <div key={i} className="aspect-video border rounded-lg overflow-hidden" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                <img src={url} alt={`Evidência ${i+1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-auto pt-12">
        <div className="text-center space-y-4">
          <div className="border-b-2 h-24 flex items-center justify-center rounded-t-lg" style={{ borderBottomColor: '#cbd5e1', backgroundColor: 'rgba(241, 245, 249, 0.5)' }}>
            {order.technicianSignatureUrl ? (
              <img src={order.technicianSignatureUrl} alt="Assinatura Técnico" className="max-h-full" crossOrigin="anonymous" />
            ) : (
              <span className="italic text-xs" style={{ color: '#cbd5e1' }}>Pendente</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#0f172a' }}>Assinatura do Técnico</p>
            <p className="text-[10px] uppercase font-bold" style={{ color: '#94a3b8' }}>Responsável pelo Atendimento</p>
          </div>
        </div>
        <div className="text-center space-y-4">
          <div className="border-b-2 h-24 flex items-center justify-center rounded-t-lg" style={{ borderBottomColor: '#cbd5e1', backgroundColor: 'rgba(241, 245, 249, 0.5)' }}>
            {order.clientSignatureUrl ? (
              <img src={order.clientSignatureUrl} alt="Assinatura Cliente" className="max-h-full" crossOrigin="anonymous" />
            ) : (
              <span className="italic text-xs" style={{ color: '#cbd5e1' }}>Pendente</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#0f172a' }}>Assinatura do Cliente</p>
            <p className="text-[10px] uppercase font-bold" style={{ color: '#94a3b8' }}>Confirmado por</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t text-center space-y-1" style={{ borderTopColor: '#e2e8f0' }}>
        <p className="text-[10px] font-medium italic" style={{ color: '#94a3b8' }}>
          Este documento é uma representação digital oficial da Ordem de Serviço emitida pelo sistema PrinterControl SaaS.
        </p>
        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#cbd5e1' }}>
          PrinterControl - Gestão Inteligente de Impressão
        </p>
      </div>
    </div>
  );
};
