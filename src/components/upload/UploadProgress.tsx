import React from 'react';
import { UploadProgress as IUploadProgress } from '../../types/file.types';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  upload: IUploadProgress;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ upload }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{upload.fileName}</p>
        <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              upload.status === 'error' ? 'bg-red-500' : 
              upload.status === 'success' ? 'bg-green-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${upload.progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1 capitalize">{upload.status} {Math.round(upload.progress)}%</p>
      </div>
      <div className="flex-shrink-0">
        {upload.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
        {upload.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
        {(upload.status === 'uploading' || upload.status === 'compressing') && (
          <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
        )}
      </div>
    </div>
  );
};
