import React, { useState } from "react";
import { ServiceOrder } from "../../types";
import { FileGallery } from "../../components/upload/FileGallery";
import { FileDropzone } from "../../components/upload/FileDropzone";
import { FileCategory } from "../../types/file.types";
import { Label } from "../../components/ui/label";

export const OSPhotosTab: React.FC<{ order: ServiceOrder }> = ({ order }) => {
  const [categoria, setCategoria] = useState<FileCategory>('fotos-defeito');

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h3 className="font-bold text-slate-800">Fazer Upload de Fotos/Evidências</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Label className="text-sm text-slate-600">Etapa/Categoria:</Label>
            <select 
              className="text-sm border-slate-300 rounded-lg p-2 w-full sm:w-auto"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as FileCategory)}
            >
              <option value="fotos-defeito">Defeito (Abertura)</option>
              <option value="fotos-manutencao">Manutenção</option>
              <option value="fotos-pecas">Peças Substituídas</option>
              <option value="documentos">Documentos Anexos</option>
            </select>
          </div>
        </div>
        <FileDropzone 
          config={{ maxSizeBytes: 20 * 1024 * 1024, acceptedFormats: ['image/*', 'video/*'], maxFiles: 10, compressionQuality: 0.8, compressionMaxWidth: 1920 }}
          categoria={categoria}
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
