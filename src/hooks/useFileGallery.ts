import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fileService } from "../services/file.service";
import { useAuth } from "../contexts/AuthContext";
import { FileModule, FileCategory } from "../types";
import { toast } from "sonner";

export function useFileGallery(params: { moduleId: FileModule, entityId: string, category?: FileCategory }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["files", params.moduleId, params.entityId, params.category],
    queryFn: () => fileService.getFiles({ 
      companyId: user?.companyId || "", 
      ...params 
    }),
    enabled: !!user?.companyId && !!params.entityId,
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => fileService.softDeleteFile(fileId, user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("Arquivo removido com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao remover arquivo: " + error.message);
    }
  });

  return {
    files: query.data || [],
    isLoading: query.isLoading,
    deleteFile: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
}
