import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-indigo-600" />
            Configurações
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie as preferências e informações da sua conta e empresa.
          </p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500">Configurações em desenvolvimento...</p>
      </div>
    </div>
  );
};
