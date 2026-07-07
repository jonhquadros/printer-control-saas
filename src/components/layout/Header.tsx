import React, { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ServiceOrderForm } from "../../features/service-orders/ServiceOrderForm";
import { ThemeToggle } from "../common/ThemeToggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle = "Visão Geral" }) => {
  const [isOSDialogOpen, setIsOSDialogOpen] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">{title}</span>
        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
        <span className="text-slate-800 dark:text-slate-100 text-sm font-bold">{subtitle}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input 
            placeholder="Pesquisar..." 
            className="h-9 w-64 pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-all rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          
          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 relative transition-colors group">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />
          
          <Button 
            onClick={() => setIsOSDialogOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all h-9 px-4 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova OS</span>
          </Button>
        </div>
      </div>

      <Dialog open={isOSDialogOpen} onOpenChange={setIsOSDialogOpen}>
        <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100">Abrir Nova Ordem de Serviço</DialogTitle>
          </DialogHeader>
          <ServiceOrderForm onSuccess={() => setIsOSDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};
