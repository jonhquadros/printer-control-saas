import { useState, useEffect } from 'react';
import { UploadedFile, FileModule } from '../../../types/file.types';
import { db } from '../../../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export const useFileGallery = (empresaId: string, modulo: FileModule, entidadeId: string) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!empresaId || !entidadeId) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'files'),
      where('empresaId', '==', empresaId),
      where('modulo', '==', modulo),
      where('entidadeId', '==', entidadeId),
      where('deleted', '==', false)
      // Note: orderBy might require a composite index
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedFiles = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        } as UploadedFile;
      });
      
      // Sort in memory to avoid index requirement for now
      fetchedFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setFiles(fetchedFiles);
      setIsLoading(false);
    }, (err) => {
      console.error('Error fetching files:', err);
      setError(err as Error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [empresaId, modulo, entidadeId]);

  return { files, isLoading, error };
};
