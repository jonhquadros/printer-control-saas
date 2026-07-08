import { useState, useCallback } from 'react';
import { getZipUrl } from '../../../services/storage.service';
import toast from 'react-hot-toast';

export const useDownloadZip = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadZip = useCallback(async (publicIds: string[], filename: string = 'arquivos.zip') => {
    setIsGenerating(true);
    try {
      // Not implemented in mock without backend
      // const url = await getZipUrl(publicIds);
      // window.open(url, '_blank');
      toast.error('Download em lote requer backend configurado');
    } catch (error: any) {
      console.error('Erro ao gerar ZIP:', error);
      toast.error('Falha ao gerar arquivo ZIP');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { downloadZip, isGenerating };
};
