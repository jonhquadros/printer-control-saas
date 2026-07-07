import React from "react";
import { UploadedFile } from "../../types";
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Download, 
  Trash2, 
  Eye,
  FileCode
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";

interface FileCardProps {
  file: UploadedFile;
  onDelete?: (id: string) => void;
  onView?: (file: UploadedFile) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onDelete, onView }) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isPdf = file.type === 'application/pdf';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-50/50 transition-all"
    >
      <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img 
            src={file.url} 
            alt={file.originalName} 
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : isVideo ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Video className="w-12 h-12 text-slate-300" />
          </div>
        ) : isPdf ? (
          <FileText className="w-12 h-12 text-slate-300" />
        ) : (
          <FileCode className="w-12 h-12 text-slate-300" />
        )}

        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur hover:bg-white"
            onClick={() => onView?.(file)}
          >
            <Eye className="w-4 h-4 text-indigo-600" />
          </Button>
          <a 
            href={file.url} 
            download={file.originalName}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur hover:bg-white flex items-center justify-center"
          >
            <Download className="w-4 h-4 text-emerald-600" />
          </a>
          {onDelete && (
            <Button 
              size="icon" 
              variant="secondary" 
              className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur hover:bg-red-50"
              onClick={() => onDelete(file.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-3">
        <p className="text-[11px] font-bold text-slate-800 truncate mb-0.5">{file.originalName}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
          <span className="text-[10px] text-slate-400">
            {file.createdAt?.seconds ? format(file.createdAt.toDate(), "dd/MM/yy") : "Recente"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
