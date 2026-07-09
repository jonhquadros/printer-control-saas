import React, { useState } from "react";
import { Package, Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import { useParts } from "../../hooks/useParts";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { PartForm } from "./components/PartForm";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";

export const PartsPage: React.FC = () => {
  const { user } = useAuth();
  const { parts, isLoading, deletePart } = useParts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filteredParts = parts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja remover esta peça do catálogo?")) {
      await deletePart.mutateAsync(id);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500 font-medium">Carregando catálogo...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Catálogo de Peças
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie itens, custos e estoque.
          </p>
        </div>
        <Button 
          onClick={() => { setSelectedPart(null); setIsFormOpen(true); }} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Peça
        </Button>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="p-4 border-b border-slate-50 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nome ou código..." 
              className="pl-10 h-10 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="text-slate-500 h-10 px-4">
               <Filter className="w-4 h-4 mr-2" />
               Filtros
             </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Cód.</th>
                <th className="px-6 py-4">Nome / Descrição</th>
                <th className="px-6 py-4">Custo Unit.</th>
                <th className="px-6 py-4">Estoque</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    Nenhuma peça encontrada.
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">{part.code}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{part.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate max-w-xs">{part.description || "Sem descrição"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">
                      R$ {part.unitCost.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-bold", part.stock <= (part.minStock || 0) ? "text-red-600" : "text-slate-700")}>
                          {part.stock}
                        </span>
                        {part.stock <= (part.minStock || 0) && (
                          <Badge className="bg-red-50 text-red-600 border-red-100 text-[8px] h-4">Crítico</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-50 text-green-700 border-green-100 text-[10px]">Ativo</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"
                          onClick={() => { setSelectedPart(part); setIsFormOpen(true); }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                          onClick={() => handleDelete(part.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPart ? "Editar Peça" : "Nova Peça"}</DialogTitle>
          </DialogHeader>
          <PartForm 
            initialData={selectedPart} 
            onSuccess={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
