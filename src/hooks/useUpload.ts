import { useState } from "react";
import { storageService } from "../services/storage.service";
import { fileService } from "../services/file.service";
import { compressionService } from "../services/compression.service";
import { useAuth } from "../contexts/AuthContext";
import { FileModule, FileCategory, UploadProgress } from "../types";
import { toast } from "sonner";

export function useUpload() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const uploadFiles = async (
    files: File[], 
    params: { moduleId: FileModule, entityId: string, category: FileCategory }
  ) => {
    if (!user) return;

    const newUploads = files.map(f => ({
      fileName: f.name,
      progress: 0,
      status: 'UPLOADING' as const
    }));

    setUploads(prev => [...prev, ...newUploads]);

    const uploadPromises = files.map(async (file, index) => {
      try {
        // 1. Compress if image
        const fileToUpload = await compressionService.compressImage(file);

        // 2. Upload to Storage
        const path = `${user.companyId}/${params.moduleId}/${params.entityId}/${params.category}`;
        const result = await storageService.uploadFile(fileToUpload, path, (progress) => {
          setUploads(prev => prev.map(u => 
            u.fileName === file.name ? { ...u, progress } : u
          ));
        });

        // 3. Register in Firestore
        await fileService.registerFile({
          companyId: user.companyId,
          moduleId: params.moduleId,
          entityId: params.entityId,
          category: params.category,
          name: result.name,
          originalName: file.name,
          url: result.url,
          size: fileToUpload.size,
          type: fileToUpload.type,
          path: result.path,
          status: 'ACTIVE',
          createdBy: user.id,
          updatedBy: user.id,
        });

        setUploads(prev => prev.map(u => 
          u.fileName === file.name ? { ...u, status: 'COMPLETED', progress: 100 } : u
        ));

      } catch (error: any) {
        console.error("Upload failed for", file.name, error);
        setUploads(prev => prev.map(u => 
          u.fileName === file.name ? { ...u, status: 'ERROR', error: error.message } : u
        ));
        toast.error(`Falha no upload de ${file.name}`);
      }
    });

    await Promise.all(uploadPromises);
  };

  const clearUploads = () => setUploads([]);

  return {
    uploadFiles,
    uploads,
    clearUploads,
    isUploading: uploads.some(u => u.status === 'UPLOADING')
  };
}
