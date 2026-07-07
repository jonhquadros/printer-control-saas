import React from "react";
import { ServiceOrder } from "../../types";
import { FileGallery } from "../files/FileGallery";

export const OSPhotosTab: React.FC<{ order: ServiceOrder }> = ({ order }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Galeria de Arquivos da OS</h3>
      </div>
      
      <FileGallery 
        moduleId="SERVICE_ORDERS" 
        entityId={order.id}
        categories={['fotos-defeito', 'fotos-manutencao', 'fotos-pecas', 'videos', 'documentos']}
      />
    </div>
  );
};
