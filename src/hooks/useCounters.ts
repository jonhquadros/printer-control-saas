import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { counterService } from "../services/counter.service";
import { PrinterCounter } from "../types";
import { toast } from "sonner";

export function useCounters(printerId?: string) {
  const queryClient = useQueryClient();

  const countersQuery = useQuery({
    queryKey: ["counters", printerId],
    queryFn: () => (printerId ? counterService.getByPrinter(printerId) : Promise.resolve([])),
    enabled: !!printerId,
  });

  const createCounter = useMutation({
    mutationFn: (data: Omit<PrinterCounter, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>) =>
      counterService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["counters", printerId] });
      queryClient.invalidateQueries({ queryKey: ["printers"] });
      queryClient.invalidateQueries({ queryKey: ["printer", printerId] });
      toast.success("Leitura registrada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao registrar leitura");
    },
  });

  const deleteCounter = useMutation({
    mutationFn: (id: string) => counterService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["counters", printerId] });
      toast.success("Leitura excluída!");
    },
  });

  return {
    counters: countersQuery.data || [],
    isLoading: countersQuery.isLoading,
    createCounter,
    deleteCounter,
  };
}
