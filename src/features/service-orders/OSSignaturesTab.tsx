import React, { useRef, useState } from "react";
import { ServiceOrder } from "../../types";
import { useServiceOrder } from "../../hooks/useServiceOrders";
import { useAuth } from "../../contexts/AuthContext";
import { uploadFile } from "../../services/storage.service";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "../../components/ui/button";

export const OSSignaturesTab: React.FC<{ order: ServiceOrder }> = ({ order }) => {
  const { updateOrder } = useServiceOrder(order.id);
  const { user } = useAuth();
  
  const techSigRef = useRef<SignatureCanvas>(null);
  const clientSigRef = useRef<SignatureCanvas>(null);
  const [savingTech, setSavingTech] = useState(false);
  const [savingClient, setSavingClient] = useState(false);

  const clearTech = () => techSigRef.current?.clear();
  const clearClient = () => clientSigRef.current?.clear();

  const handleSaveTech = async () => {
    if (!techSigRef.current || techSigRef.current.isEmpty() || !user?.companyId || !user?.id) return;
    setSavingTech(true);
    try {
      const dataUrl = techSigRef.current.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `tech_sig_${order.id}.png`, { type: "image/png" });
      
      const result = await uploadFile(file, { maxSizeBytes: 5 * 1024 * 1024, acceptedFormats: ['image/png'], maxFiles: 1, compressionQuality: 1, compressionMaxWidth: 800 }, {
        empresaId: user.companyId,
        modulo: 'service-orders',
        entidadeId: order.id,
        categoria: 'documentos',
        userId: user.id
      });
      await updateOrder.mutateAsync({ technicianSignatureUrl: result.url });
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar assinatura do técnico.");
    } finally {
      setSavingTech(false);
    }
  };

  const handleSaveClient = async () => {
    if (!clientSigRef.current || clientSigRef.current.isEmpty() || !user?.companyId || !user?.id) return;
    setSavingClient(true);
    try {
      const dataUrl = clientSigRef.current.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `client_sig_${order.id}.png`, { type: "image/png" });
      
      const result = await uploadFile(file, { maxSizeBytes: 5 * 1024 * 1024, acceptedFormats: ['image/png'], maxFiles: 1, compressionQuality: 1, compressionMaxWidth: 800 }, {
        empresaId: user.companyId,
        modulo: 'service-orders',
        entidadeId: order.id,
        categoria: 'documentos',
        userId: user.id
      });
      await updateOrder.mutateAsync({ clientSignatureUrl: result.url });
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar assinatura do cliente.");
    } finally {
      setSavingClient(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Assinatura do Técnico */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Assinatura do Técnico</h3>
        {order.technicianSignatureUrl ? (
          <div className="flex flex-col items-center">
            <img src={order.technicianSignatureUrl} alt="Assinatura Técnico" className="border rounded-md w-full max-w-sm" />
            <p className="text-xs text-slate-500 mt-2 font-medium">Assinatura registrada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-md bg-slate-50 w-full h-40">
              <SignatureCanvas 
                ref={techSigRef} 
                canvasProps={{ className: "w-full h-full" }} 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={clearTech}>Limpar</Button>
              <Button size="sm" onClick={handleSaveTech} disabled={savingTech} className="bg-indigo-600 hover:bg-indigo-700">
                {savingTech ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Assinatura do Cliente */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Assinatura do Cliente</h3>
        {order.clientSignatureUrl ? (
          <div className="flex flex-col items-center">
            <img src={order.clientSignatureUrl} alt="Assinatura Cliente" className="border rounded-md w-full max-w-sm" />
            <p className="text-xs text-slate-500 mt-2 font-medium">Assinatura registrada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-md bg-slate-50 w-full h-40">
              <SignatureCanvas 
                ref={clientSigRef} 
                canvasProps={{ className: "w-full h-full" }} 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={clearClient}>Limpar</Button>
              <Button size="sm" onClick={handleSaveClient} disabled={savingClient} className="bg-indigo-600 hover:bg-indigo-700">
                {savingClient ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
