import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/companies": "Empresas",
  "/printers": "Impressoras",
  "/service-orders": "Ordens de Serviço",
  "/users": "Usuários",
  "/reports": "Relatórios",
  "/whatsapp": "WhatsApp",
  "/ai": "Inteligência Artificial",
  "/settings": "Configurações",
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Sistema";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="PrinterControl" subtitle={title} />
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
