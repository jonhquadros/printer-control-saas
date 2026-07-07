import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Printer, 
  ClipboardList, 
  Users, 
  Building2, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Building2, label: "Empresas", href: "/companies" },
  { icon: Printer, label: "Impressoras", href: "/printers" },
  { icon: ClipboardList, label: "Ordens de Serviço", href: "/service-orders" },
  { icon: Users, label: "Usuários", href: "/users" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const items = [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: Printer, label: "Impressoras", href: "/printers" },
      { icon: ClipboardList, label: "Ordens de Serviço", href: "/service-orders" },
    ];

    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      items.splice(1, 0, { icon: Building2, label: "Empresas", href: "/companies" });
      items.push({ icon: Users, label: "Usuários", href: "/users" });
      items.push({ icon: FileText, label: "Relatórios", href: "/reports" });
      items.push({ icon: MessageSquare, label: "WhatsApp", href: "/whatsapp" });
      items.push({ icon: Sparkles, label: "IA", href: "/ai" });
      items.push({ icon: Settings, label: "Configurações", href: "/settings" });
    }

    return items;
  };

  const handleLogout = async () => {
    await authService.logout();
  };

  const getInitials = (name: string = "") => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-2 pb-safe">
        <nav className="flex items-center justify-around h-16">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-400 dark:text-slate-500"
                )}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 shadow-sm z-20",
        collapsed ? "w-20" : "w-64"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 min-h-[64px]">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-indigo-100 dark:shadow-none shadow-lg">
            <Printer className="text-white w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 truncate">
              PrinterControl
            </span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : ""}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                )} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
          <div className={cn(
            "flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg transition-all",
            collapsed ? "justify-center" : "px-3"
          )}>
            <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center font-bold text-xs text-indigo-700 dark:text-indigo-300 shrink-0 border border-indigo-200 dark:border-indigo-800">
              {getInitials(user?.name)}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold truncate">
                  {user?.role}
                </p>
              </div>
            )}
            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="mt-4 w-full flex items-center justify-center py-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-dashed border-slate-200 dark:border-slate-800 rounded-md hover:border-indigo-200 dark:hover:border-indigo-800"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
};
