import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, Image, Film, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  isLoading?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ 
  onFilesSelected, 
  maxFiles = 10,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    'application/pdf': ['.pdf'],
    'video/*': ['.mp4', '.mov']
  },
  isLoading 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    disabled: isLoading
  } as any);

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-3xl p-10 transition-all
          ${isDragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`p-4 rounded-2xl bg-white shadow-sm border border-slate-100 transition-transform group-hover:scale-110 ${isDragActive ? 'scale-110 ring-4 ring-indigo-50' : ''}`}>
            <Upload className={`w-8 h-8 ${isDragActive ? 'text-indigo-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-700">
              {isDragActive ? "Solte os arquivos aqui" : "Arraste e solte ou clique para selecionar"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Imagens, PDFs e Vídeos (máx {maxFiles} arquivos)
            </p>
          </div>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 text-xs text-red-600"
        >
          <X className="w-4 h-4" />
          <span>Alguns arquivos foram rejeitados por exceder o limite ou formato inválido.</span>
        </motion.div>
      )}
    </div>
  );
};
