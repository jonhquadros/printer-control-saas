import React from 'react';
import { UploadedFile } from '../../types/file.types';
import { buildThumbnailUrl } from '../../services/cloudinary.service';
import { FileText, Film, File } from 'lucide-react';

interface FilePreviewProps {
  file: UploadedFile;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  if (file.resourceType === 'image') {
    const thumbUrl = buildThumbnailUrl(file.publicId, file.resourceType);
    return (
      <img 
        src={thumbUrl || file.url} 
        alt={file.nomeOriginal} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    );
  }

  if (file.resourceType === 'video') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
        <Film className="w-12 h-12 opacity-50" />
      </div>
    );
  }

  if (file.format === 'pdf') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500">
        <FileText className="w-12 h-12 opacity-70" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
      <File className="w-12 h-12 opacity-50" />
    </div>
  );
};
