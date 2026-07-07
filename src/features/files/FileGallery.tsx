import React, { useState } from "react";
import { FileModule, FileCategory, UploadedFile } from "../../types";
import { useFileGallery } from "../../hooks/useFileGallery";
import { useUpload } from "../../hooks/useUpload";
import { FileDropzone } from "../../components/upload/FileDropzone";
import { UploadProgressDisplay } from "../../components/upload/UploadProgress";
import { FileCard } from "./FileCard";
import { motion, AnimatePresence } from "motion/react";
import { Image, FileText, Video as VideoIcon, LayoutGrid, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";

interface FileGalleryProps {
  moduleId: FileModule;
  entityId: string;
  categories?: FileCategory[];
  canUpload?: boolean;
}

export const FileGallery: React.FC<FileGalleryProps> = ({ 
  moduleId, 
  entityId, 
  categories, 
  canUpload = true 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | 'all'>('all');
  const [showUpload, setShowUpload] = useState(false);
  const { files, isLoading, deleteFile } = useFileGallery({ 
    moduleId, 
    entityId, 
    category: selectedCategory === 'all' ? undefined : selectedCategory 
  });
  
  const { uploadFiles, uploads, isUploading } = useUpload();

  const handleUpload = async (acceptedFiles: File[]) => {
    // For now, if multiple categories exist, we upload to the first one or a default
    const category = selectedCategory === 'all' ? (categories?.[0] || 'documentos') : selectedCategory;
    await uploadFiles(acceptedFiles, { moduleId, entityId, category });
    if (!isUploading) {
      setTimeout(() => setShowUpload(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-5 ${selectedCategory === 'all' ? 'bg-indigo-600' : 'text-slate-500'}`}
          >
            <LayoutGrid className="w-3 h-3 mr-2" />
            Todos
          </Button>
          {categories?.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 ${selectedCategory === cat ? 'bg-indigo-600' : 'text-slate-500'}`}
            >
              {cat.includes('fotos') ? <Image className="w-3 h-3 mr-2" /> : 
               cat === 'videos' ? <VideoIcon className="w-3 h-3 mr-2" /> : 
               <FileText className="w-3 h-3 mr-2" />}
              <span className="capitalize">{cat.replace('fotos-', '')}</span>
            </Button>
          ))}
        </div>

        {canUpload && (
          <Button 
            onClick={() => setShowUpload(!showUpload)}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Arquivo
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-1 bg-slate-50 rounded-3xl mb-6">
              <FileDropzone 
                onFilesSelected={handleUpload} 
                isLoading={isUploading} 
              />
              <UploadProgressDisplay uploads={uploads} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <LayoutGrid className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">Nenhum arquivo encontrado</p>
          <p className="text-xs text-slate-400 mt-1">Selecione uma categoria ou adicione um novo arquivo</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {files.map(file => (
              <FileCard 
                key={file.id} 
                file={file} 
                onDelete={canUpload ? deleteFile : undefined}
                onView={(f) => window.open(f.url, '_blank')}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
