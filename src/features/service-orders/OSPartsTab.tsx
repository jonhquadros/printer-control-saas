import React, { useState, useEffect } from "react";
import { ServiceOrder, OSPart } from "../../types";
import { useServiceOrder } from "../../hooks/useServiceOrders";
import { useParts } from "../../hooks/useParts";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Trash2, Plus, Search } from "lucide-react";

export const OSPartsTab: React.FC<{ order: ServiceOrder }> = ({ order }) => {
  const { updateOrder } = useServiceOrder(order.id);
  const { parts: catalogParts } = useParts();
  const [parts, setParts] = useState<OSPart[]>(order.parts || []);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState(0);
  const [showCatalog, setShowCatalog] = useState(false);
  const [laborCost, setLaborCost] = useState(0);

  useEffect(() => {
    // Estimate labor cost if totalCost exists but pieces are less
    const piecesTotal = (order.parts || []).reduce((acc, p) => acc + (p.quantity * p.cost), 0);
    setLaborCost((order.totalCost || 0) - piecesTotal);
  }, [order.parts, order.totalCost]);

  const handleAddPart = (partData?: { name: string, cost: number }) => {
    const finalName = partData?.name || name;
    const finalCost = partData?.cost ?? cost;

    if (!finalName.trim()) return;

    const newPart: OSPart = {
      id: Math.random().toString(36).substring(7),
      name: finalName,
      quantity,
      cost: finalCost
    };

    const updatedParts = [...parts, newPart];
    setParts(updatedParts);
    const piecesTotal = updatedParts.reduce((acc, p) => acc + (p.quantity * p.cost), 0);
    updateOrder.mutate({ 
      parts: updatedParts, 
      totalCost: piecesTotal + laborCost 
    });
    
    setName("");
    setQuantity(1);
    setCost(0);
    setShowCatalog(false);
  };

  const handleUpdateLabor = (val: number) => {
    setLaborCost(val);
    const piecesTotal = parts.reduce((acc, p) => acc + (p.quantity * p.cost), 0);
    updateOrder.mutate({ totalCost: piecesTotal + val });
  };

  const handleRemovePart = (partId: string) => {
    const updatedParts = parts.filter(p => p.id !== partId);
    setParts(updatedParts);
    const totalCost = updatedParts.reduce((acc, p) => acc + (p.quantity * p.cost), 0);
    updateOrder.mutate({ parts: updatedParts, totalCost });
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Peças Utilizadas</h3>
        
        <div className="flex flex-col gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Mão de Obra (R$)</label>
              <Input 
                type="number" 
                value={laborCost} 
                onChange={e => handleUpdateLabor(Number(e.target.value))} 
                placeholder="0.00"
                className="h-9" 
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowCatalog(!showCatalog)}
                className="h-9 border-indigo-200 text-indigo-600"
              >
                <Search className="w-4 h-4 mr-2" />
                Buscar no Catálogo
              </Button>
            </div>
          </div>

          {showCatalog && (
            <div className="p-4 bg-white rounded-lg border shadow-sm animate-in slide-in-from-top-2 duration-300">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Catálogo de Peças</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                {catalogParts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">Nenhuma peça cadastrada no catálogo.</p>
                ) : (
                  catalogParts.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAddPart({ name: p.name, cost: p.unitCost })}
                      className="text-left p-2 rounded border hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex justify-between items-center group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-700">{p.name}</p>
                        <p className="text-[10px] text-slate-500">Cód: {p.code}</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-600">R$ {p.unitCost.toLocaleString('pt-BR')}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex items-end gap-2 p-4 bg-slate-50 rounded-lg border">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Manual: Peça</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Rolo Fusor" className="h-9" />
            </div>
            <div className="w-24 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Qtd</label>
              <Input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="h-9" />
            </div>
            <div className="w-32 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Custo Unit.</label>
              <Input type="number" min="0" step="0.01" value={cost} onChange={e => setCost(Number(e.target.value))} className="h-9" />
            </div>
            <Button onClick={() => handleAddPart()} disabled={!name.trim() || updateOrder.isPending} className="bg-indigo-600 hover:bg-indigo-700 h-9">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {parts.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-2">Peça</th>
                  <th className="px-4 py-2 text-center">Qtd</th>
                  <th className="px-4 py-2 text-right">Custo Unit.</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {parts.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{p.name}</td>
                    <td className="px-4 py-2 text-center">{p.quantity}</td>
                    <td className="px-4 py-2 text-right">R$ {p.cost.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-900">R$ {(p.quantity * p.cost).toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleRemovePart(p.id)} className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t">
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right uppercase text-xs text-slate-500">Total Peças:</td>
                  <td className="px-4 py-2 text-right text-slate-700">R$ {parts.reduce((acc, p) => acc + (p.quantity * p.cost), 0).toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right uppercase text-xs text-slate-500">Mão de Obra:</td>
                  <td className="px-4 py-2 text-right text-slate-700">R$ {laborCost.toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right uppercase text-xs text-indigo-600">Custo Total Geral:</td>
                  <td className="px-4 py-2 text-right text-indigo-600 text-lg">R$ {order.totalCost?.toFixed(2) || '0.00'}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Nenhuma peça registrada nesta OS.</p>
        )}
      </div>
    </div>
  );
};
