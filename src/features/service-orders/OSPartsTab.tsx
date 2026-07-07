import React, { useState } from "react";
import { ServiceOrder, OSPart } from "../../types";
import { useServiceOrder } from "../../hooks/useServiceOrders";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Trash2, Plus } from "lucide-react";

export const OSPartsTab: React.FC<{ order: ServiceOrder }> = ({ order }) => {
  const { updateOrder } = useServiceOrder(order.id);
  const [parts, setParts] = useState<OSPart[]>(order.parts || []);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState(0);

  const handleAddPart = () => {
    if (!name.trim()) return;
    const newPart: OSPart = {
      id: Math.random().toString(36).substring(7),
      name,
      quantity,
      cost
    };
    const updatedParts = [...parts, newPart];
    setParts(updatedParts);
    const totalCost = updatedParts.reduce((acc, p) => acc + (p.quantity * p.cost), 0);
    updateOrder.mutate({ parts: updatedParts, totalCost });
    
    setName("");
    setQuantity(1);
    setCost(0);
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
        
        <div className="flex items-end gap-2 mb-6 p-4 bg-slate-50 rounded-lg border">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Peça</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Rolo Fusor" className="h-8" />
          </div>
          <div className="w-24 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Qtd</label>
            <Input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="h-8" />
          </div>
          <div className="w-32 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Custo Unit.</label>
            <Input type="number" min="0" step="0.01" value={cost} onChange={e => setCost(Number(e.target.value))} className="h-8" />
          </div>
          <Button onClick={handleAddPart} disabled={!name.trim() || updateOrder.isPending} className="bg-indigo-600 hover:bg-indigo-700 h-8">
            <Plus className="w-4 h-4" />
          </Button>
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
                  <td colSpan={3} className="px-4 py-2 text-right uppercase text-xs text-slate-500">Custo Total em Peças:</td>
                  <td className="px-4 py-2 text-right text-indigo-600">R$ {order.totalCost?.toFixed(2) || '0.00'}</td>
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
