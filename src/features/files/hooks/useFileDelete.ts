import { useState, useCallback } from 'react';
import { deleteFile as storageDeleteFile } from '../../../services/storage.service';
import toast from 'react-hot-toast';

export const useFileDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFile = useCallback(async (fileId: string, userId: string) => {
    setIsDeleting(true);
    try {
      await storageDeleteFile(fileId, userId);
      toast.success('Arquivo removido com sucesso');
    } catch (error: any) {
      console.error('Erro ao deletar arquivo:', error);
      toast.error('Falha ao remover arquivo');
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { deleteFile, isDeleting };
};
