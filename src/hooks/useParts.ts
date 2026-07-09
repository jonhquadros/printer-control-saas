import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { partsService } from "../services/parts.service";
import { Part } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { PartFormValues } from "../schemas/financial.schema";

export function useParts() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId;

  const query = useQuery({
    queryKey: ["parts", companyId],
    queryFn: () => companyId ? partsService.getAll(companyId) : Promise.resolve([]),
    enabled: !!companyId,
  });

  const createPart = useMutation({
    mutationFn: (data: PartFormValues) => {
      if (!companyId || !user?.id) throw new Error("Missing auth info");
      return partsService.create(data, companyId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });

  const updatePart = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartFormValues> }) => {
      if (!user?.id) throw new Error("Missing auth info");
      return partsService.update(id, data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });

  const deletePart = useMutation({
    mutationFn: (id: string) => {
      if (!user?.id) throw new Error("Missing auth info");
      return partsService.delete(id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });

  return {
    parts: query.data || [],
    isLoading: query.isLoading,
    createPart,
    updatePart,
    deletePart,
  };
}
