import { useQuery } from "@tanstack/react-query";
import { auditService } from "../services/audit.service";
import { AuditModule, AuditAction } from "../types/audit";

export function useAuditLogs(filters: {
  companyId?: string;
  userId?: string;
  module?: AuditModule;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
}) {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => auditService.getLogs(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
  });
}
