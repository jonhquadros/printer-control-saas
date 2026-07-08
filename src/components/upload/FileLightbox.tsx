import React, { useState } from 'react';
import { UploadedFile } from '../../types/file.types';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';

interface FileLightboxProps {
  files: UploadedFile[];
  initialIndex: number;
  onClose: () => void;
}

export const FileLightbox: React.FC<FileLightboxProps> = ({ files, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (files.length === 0) return null;

  const currentFile = files[currentIndex];
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % files.length);
  };
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 overflow-hidden bg-black/95 border-0">
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
          <p className="text-white font-medium truncate pr-4">{currentFile.nomeOriginal}</p>
          <div className="flex items-center gap-4">
            <a 
              href={currentFile.urlOriginal} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Download className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center relative">
          {files.length > 1 && (
            <button 
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <div className="w-full h-full p-12 flex items-center justify-center">
            {currentFile.resourceType === 'image' ? (
              <img 
                src={currentFile.url} 
                alt={currentFile.nomeOriginal}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video 
                src={currentFile.url} 
                controls 
                className="max-w-full max-h-full"
                autoPlay
              />
            )}
          </div>

          {files.length > 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm pointer-events-none">
          {currentIndex + 1} de {files.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};
