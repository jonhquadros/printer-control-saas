import { useQuery } from "@tanstack/react-query";
import { financialService } from "../services/financial.service";
import { useAuth } from "../contexts/AuthContext";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export function useFinancialDashboard(period: { start: Date, end: Date }) {
  const { user } = useAuth();
  const companyId = user?.companyId;

  const kpiQuery = useQuery({
    queryKey: ["financialKPIs", companyId, period.start.toISOString(), period.end.toISOString()],
    queryFn: () => companyId ? financialService.getDashboardKPIs(companyId, period.start, period.end) : null,
    enabled: !!companyId,
  });

  const productivityQuery = useQuery({
    queryKey: ["technicianProductivity", companyId, period.start.toISOString(), period.end.toISOString()],
    queryFn: () => companyId ? financialService.getTechnicianProductivity(companyId, period.start, period.end) : [],
    enabled: !!companyId,
  });

  const summariesQuery = useQuery({
    queryKey: ["monthlySummaries", companyId],
    queryFn: () => companyId ? financialService.getMonthlySummaries(companyId) : [],
    enabled: !!companyId,
  });

  return {
    kpis: kpiQuery.data,
    productivity: productivityQuery.data || [],
    summaries: summariesQuery.data || [],
    isLoading: kpiQuery.isLoading || productivityQuery.isLoading || summariesQuery.isLoading,
  };
}
