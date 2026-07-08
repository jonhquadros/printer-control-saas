import React from 'react';
import { UploadedFile } from '../../types/file.types';
import { Download, Trash2, MoreVertical, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import { useFileDelete } from '../../features/files/hooks/useFileDelete';

interface FileActionsProps {
  file: UploadedFile;
}

export const FileActions: React.FC<FileActionsProps> = ({ file }) => {
  const { user } = useAuth();
  const { deleteFile, isDeleting } = useFileDelete();

  // Permissões
  const canDelete = user?.role === 'admin' || user?.role === 'manager';

  const handleDownload = () => {
    // In a real app, you'd get the download URL from the Cloud Function
    window.open(file.urlOriginal, '_blank');
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este arquivo?')) {
      if (user) {
        deleteFile(file.id, user.id);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1.5 bg-white/90 backdrop-blur rounded-md shadow-sm border text-slate-700 hover:bg-slate-50 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => window.open(file.url, '_blank')} className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          <span>Abrir</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
          <Download className="w-4 h-4 mr-2" />
          <span>Baixar Original</span>
        </DropdownMenuItem>
        
        {canDelete && (
          <DropdownMenuItem 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            <span>Excluir</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
