import React from "react";
import { ServiceOrder } from "../../types";
import { FileGallery } from "../../components/upload/FileGallery";
import { FileDropzone } from "../../components/upload/FileDropzone";

export const OSPhotosTab: React.FC<{ order: ServiceOrder }> = ({ order }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
      <div>
        <h3 className="font-bold text-slate-800 mb-4">Fazer Upload de Fotos/Evidências</h3>
        <FileDropzone 
          config={{ maxSizeBytes: 20 * 1024 * 1024, acceptedFormats: ['image/*', 'video/*'], maxFiles: 10, compressionQuality: 0.8, compressionMaxWidth: 1920 }}
          categoria="fotos-manutencao"
          modulo="service-orders"
          entidadeId={order.id}
        />
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6">Galeria de Arquivos da OS</h3>
        <FileGallery 
          modulo="service-orders" 
          entidadeId={order.id}
        />
      </div>
    </div>
  );
};
