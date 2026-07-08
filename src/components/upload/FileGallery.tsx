import React, { useState } from 'react';
import { FileModule, FileCategory } from '../../types/file.types';
import { useFileGallery } from '../../features/files/hooks/useFileGallery';
import { FileCard } from './FileCard';
import { Loader2 } from 'lucide-react';
import { FileLightbox } from './FileLightbox';
import { useAuth } from '../../contexts/AuthContext';

interface FileGalleryProps {
  modulo: FileModule;
  entidadeId: string;
  categoria?: FileCategory; // se omitido, mostra todas as categorias dessa entidade
}

export const FileGallery: React.FC<FileGalleryProps> = ({ modulo, entidadeId, categoria }) => {
  const { user } = useAuth();
  const { files, isLoading } = useFileGallery(user?.empresaId || '', modulo, entidadeId);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredFiles = categoria ? files.filter(f => f.categoria === categoria) : files;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (filteredFiles.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-sm text-slate-500 font-medium">Nenhum arquivo encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFiles.map((file, index) => (
          <FileCard 
            key={file.id} 
            file={file} 
            onClick={() => {
              if (file.resourceType === 'image' || file.resourceType === 'video') {
                setLightboxIndex(index);
              } else {
                window.open(file.url, '_blank');
              }
            }}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <FileLightbox 
          files={filteredFiles.filter(f => f.resourceType === 'image' || f.resourceType === 'video')}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};
