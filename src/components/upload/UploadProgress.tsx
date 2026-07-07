import React from "react";
import { UploadProgress as UploadProgressType } from "../../types";
import { Progress } from "../ui/progress";
import { CheckCircle2, XCircle, File, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UploadProgressDisplayProps {
  uploads: UploadProgressType[];
}

export const UploadProgressDisplay: React.FC<UploadProgressDisplayProps> = ({ uploads }) => {
  if (uploads.length === 0) return null;

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Uploads em andamento</h4>
        <span className="text-[10px] font-bold text-slate-400">{uploads.length} arquivo(s)</span>
      </div>
      <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {uploads.map((upload, idx) => (
            <motion.div 
              key={`${upload.fileName}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  {upload.status === 'UPLOADING' ? (
                    <Loader2 className="w-3 h-3 text-indigo-600 animate-spin" />
                  ) : upload.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className="text-xs font-medium text-slate-700 truncate">{upload.fileName}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 shrink-0">
                  {Math.round(upload.progress)}%
                </span>
              </div>
              <Progress value={upload.progress} className="h-1 bg-slate-100" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
