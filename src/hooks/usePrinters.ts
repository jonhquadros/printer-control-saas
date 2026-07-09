import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { printerService } from "../services/printer.service";
import { Printer } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function usePrinters() {
  const queryClient = useQueryClient();
  const { user, isGlobal } = useAuth();
  const companyId = user?.companyId;

  const printersQuery = useQuery({
    queryKey: ["printers", companyId, isGlobal],
    queryFn: () => isGlobal ? printerService.getAll() : (companyId ? printerService.getAll(companyId) : Promise.resolve([])),
    enabled: !!user,
  });

  const createPrinter = useMutation({
    mutationFn: (data: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>) =>
      printerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
  });

  const updatePrinter = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Printer> }) =>
      printerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
  });

  const deletePrinter = useMutation({
    mutationFn: (id: string) => printerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
  });

  return {
    printers: printersQuery.data || [],
    isLoading: printersQuery.isLoading,
    createPrinter,
    updatePrinter,
    deletePrinter,
  };
}

export function usePrinter(id: string) {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ["printer", id],
    queryFn: () => printerService.getById(id),
    enabled: !!user && !!id,
  });

  return {
    printer: query.data,
    isLoading: query.isLoading,
  };
}
