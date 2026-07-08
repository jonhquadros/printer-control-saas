import React from 'react';
import { UploadedFile } from '../../types/file.types';
import { FilePreview } from './FilePreview';
import { FileActions } from './FileActions';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FileCardProps {
  file: UploadedFile;
  onClick: () => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onClick }) => {
  return (
    <div className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="aspect-square w-full bg-slate-100 cursor-pointer overflow-hidden relative"
        onClick={onClick}
      >
        <FilePreview file={file} />
      </div>
      
      <div className="p-3">
        <p className="text-sm font-medium text-slate-900 truncate" title={file.nomeOriginal}>
          {file.nomeOriginal}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-slate-500">
            {formatDistanceToNow(file.createdAt, { addSuffix: true, locale: ptBR })}
          </p>
          <p className="text-xs font-medium text-slate-400">
            {(file.bytes / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FileActions file={file} />
      </div>
    </div>
  );
};
