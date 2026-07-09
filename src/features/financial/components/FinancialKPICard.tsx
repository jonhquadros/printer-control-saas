import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

interface FinancialKPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  description?: string;
}

export const FinancialKPICard: React.FC<FinancialKPICardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  bg,
  description 
}) => {
  return (
    <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-2xl", bg)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {description && <p className="text-[10px] text-slate-500 mt-1 font-medium">{description}</p>}
        </div>
      </div>
    </Card>
  );
};
