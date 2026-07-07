import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "../services/report.service";
import { useAuth } from "../contexts/AuthContext";
import { GeneratedReport, ReportType, ReportFormat, ReportFilter } from "../types";
import { toast } from "sonner";

export function useReports() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: ["reports", user?.companyId],
    queryFn: () => reportService.getReports(user?.companyId || ""),
    enabled: !!user?.companyId,
  });

  const generateMutation = useMutation({
    mutationFn: async (params: { 
      type: ReportType, 
      format: ReportFormat, 
      name: string, 
      filters: ReportFilter,
      data: any // Data fetched based on filters
    }) => {
      const reportId = await reportService.createReport({
        companyId: user?.companyId || "",
        type: params.type,
        name: params.name,
        format: params.format,
        filters: params.filters,
        createdBy: user?.id || "",
      });

      try {
        const blob = await reportService.generateFile({
          type: params.type,
          format: params.format,
          data: params.data,
          name: params.name
        });

        // In a real SaaS, we would upload this blob to Firebase Storage and get a URL
        // For this demo, we'll just create a local URL or simulate completion
        const url = window.URL.createObjectURL(blob);
        
        await reportService.updateReportStatus(reportId, 'COMPLETED', url);
        
        // Trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `${params.name}.${params.format === 'EXCEL' ? 'xlsx' : params.format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return reportId;
      } catch (error) {
        await reportService.updateReportStatus(reportId, 'FAILED');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Relatório gerado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao gerar relatório: " + error.message);
    }
  });

  return {
    reports: reportsQuery.data || [],
    isLoading: reportsQuery.isLoading,
    isGenerating: generateMutation.isPending,
    generateReport: generateMutation.mutateAsync,
  };
}
