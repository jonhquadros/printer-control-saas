import { useState, useCallback } from 'react';
import { UploadConfig, UploadProgress, FileCategory, FileModule } from '../../../types/file.types';
import { uploadFile } from '../../../services/storage.service';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export const useUpload = (config: UploadConfig) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = useCallback(async (
    files: File[], 
    context: { empresaId: string; modulo: FileModule; entidadeId: string; categoria: FileCategory; userId: string }
  ) => {
    if (files.length > config.maxFiles) {
      toast.error(`Máximo de ${config.maxFiles} arquivos permitidos por vez.`);
      return;
    }

    const newUploads = files.map(file => ({
      fileId: uuidv4(),
      fileName: file.name,
      progress: 0,
      status: 'compressing' as const
    }));

    setUploads(prev => [...prev, ...newUploads]);
    setIsUploading(true);

    const promises = files.map(async (file, index) => {
      const uploadItem = newUploads[index];
      
      try {
        if (file.size > config.maxSizeBytes) {
          throw new Error(`Arquivo excede o tamanho máximo de ${config.maxSizeBytes / 1024 / 1024}MB`);
        }
        
        if (config.acceptedFormats.length > 0 && !config.acceptedFormats.some(format => {
          if (format.endsWith('/*')) {
            return file.type.startsWith(format.replace('/*', ''));
          }
          return file.type === format;
        })) {
          throw new Error('Formato de arquivo não suportado');
        }

        const result = await uploadFile(file, config, context, (progress) => {
          setUploads(prev => prev.map(u => 
            u.fileId === uploadItem.fileId 
              ? { ...u, progress, status: progress > 30 ? 'uploading' : 'compressing' } 
              : u
          ));
        });

        setUploads(prev => prev.map(u => 
          u.fileId === uploadItem.fileId 
            ? { ...u, progress: 100, status: 'success', result } 
            : u
        ));
        
        return result;
      } catch (error: any) {
        setUploads(prev => prev.map(u => 
          u.fileId === uploadItem.fileId 
            ? { ...u, status: 'error', error: error.message } 
            : u
        ));
        toast.error(`Erro ao enviar ${file.name}: ${error.message}`);
        return null;
      }
    });

    await Promise.all(promises);
    setIsUploading(false);
  }, [config]);

  const cancelUpload = useCallback((fileId: string) => {
    // Basic implementation: just remove from list. 
    // True cancellation requires aborting the XHR in storage.service.ts
    setUploads(prev => prev.filter(u => u.fileId !== fileId));
  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  return { uploadFiles, uploads, isUploading, cancelUpload, clearUploads };
};
