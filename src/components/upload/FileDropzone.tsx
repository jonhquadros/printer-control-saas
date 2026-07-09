import React, { useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { UploadConfig, FileCategory, FileModule } from '../../types/file.types';
import { useUpload } from '../../features/files/hooks/useUpload';
import { UploadProgress } from './UploadProgress';
import { useAuth } from '../../contexts/AuthContext';

interface FileDropzoneProps {
  config: UploadConfig;
  categoria: FileCategory;
  modulo: FileModule;
  entidadeId: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ config, categoria, modulo, entidadeId }) => {
  const { user } = useAuth();
  const { uploadFiles, uploads, isUploading } = useUpload(config);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (user?.companyId && user?.id) {
      uploadFiles(acceptedFiles, {
        empresaId: user.companyId,
        modulo,
        entidadeId,
        categoria,
        userId: user.id
      });
    }
  }, [user, modulo, entidadeId, categoria, uploadFiles]);

  // @ts-ignore
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: config.acceptedFormats.length > 0 
      ? config.acceptedFormats.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {} as Accept)
      : undefined,
    maxSize: config.maxSizeBytes,
    maxFiles: config.maxFiles,
    disabled: isUploading
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-700">
          {isDragActive ? "Solte os arquivos aqui" : "Arraste e solte arquivos aqui, ou clique para selecionar"}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {config.acceptedFormats.join(', ')} (Max: {Math.round(config.maxSizeBytes / 1024 / 1024)}MB)
        </p>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-3">
          {uploads.map(upload => (
            <UploadProgress key={upload.fileId} upload={upload} />
          ))}
        </div>
      )}
    </div>
  );
};
