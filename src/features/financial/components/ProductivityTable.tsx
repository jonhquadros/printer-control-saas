import React from "react";
import { TechnicianProductivity } from "../../../types";
import { Card } from "../../../components/ui/card";

interface ProductivityTableProps {
  data: TechnicianProductivity[];
}

export const ProductivityTable: React.FC<ProductivityTableProps> = ({ data }) => {
  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <div className="p-6 border-b border-slate-50 bg-white">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Produtividade dos Técnicos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Técnico</th>
              <th className="px-6 py-4">OS Abertas</th>
              <th className="px-6 py-4">OS Finalizadas</th>
              <th className="px-6 py-4">Peças (R$)</th>
              <th className="px-6 py-4">Mão de Obra (R$)</th>
              <th className="px-6 py-4 text-right">Total Gerado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Nenhum dado de produtividade no período.
                </td>
              </tr>
            ) : (
              data.map((tech) => (
                <tr key={tech.technicianId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800 text-sm">{tech.technicianName}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{tech.totalOs}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{tech.totalFinishedOs}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">R$ {tech.totalPartsCost.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">R$ {tech.totalLaborCost.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-indigo-600">
                      R$ {(tech.totalPartsCost + tech.totalLaborCost).toLocaleString('pt-BR')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
