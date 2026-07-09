import React from 'react';
import { Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useInAppNotifications } from "@/hooks/useSettings";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useInAppNotifications(
    user?.companyId, 
    user?.uid
  );

  const handleNotificationClick = (n: any) => {
    markAsRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-500" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-2xl shadow-2xl border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="p-4 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs">Notificações</h3>
          {unreadCount > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-900">Tudo em dia!</p>
              <p className="text-xs text-slate-500 mt-1">Você não tem notificações no momento.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem 
                key={n.id} 
                className={cn(
                  "p-4 flex flex-col items-start gap-1 cursor-pointer transition-colors focus:bg-slate-50",
                  !n.read && "bg-indigo-50/30 border-l-4 border-indigo-500"
                )}
                onClick={() => handleNotificationClick(n)}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span className={cn("text-sm font-bold", !n.read ? "text-indigo-900" : "text-slate-900")}>
                    {n.title}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                    {formatDistanceToNow(n.timestamp, { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-3 text-center">
          <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
            Ver todas as notificações
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
