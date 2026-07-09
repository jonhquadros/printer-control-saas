import { useRole } from "./useRole";

export type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
export type Resource = 'PRINTERS' | 'SERVICE_ORDERS' | 'COMPANIES' | 'USERS' | 'REPORTS' | 'AUDIT_LOGS' | 'SETTINGS';

export function usePermissions() {
  const { role, isSuperAdmin } = useRole();

  const can = (action: Action, resource: Resource): boolean => {
    if (isSuperAdmin) return true;

    switch (role) {
      case 'ADMIN':
        if (resource === 'COMPANIES') return action === 'READ' || action === 'UPDATE';
        if (resource === 'AUDIT_LOGS') return action === 'READ';
        return true; 
      
      case 'MANAGER':
        if (resource === 'USERS') return action === 'READ';
        if (resource === 'SETTINGS') return false;
        if (resource === 'AUDIT_LOGS') return false;
        return true; // Manager can manage Printers, OS, Reports in their scope (global scope via rules)

      case 'TECHNICIAN':
        if (resource === 'SERVICE_ORDERS') return action === 'READ' || action === 'UPDATE' || action === 'CREATE';
        if (resource === 'PRINTERS') return action === 'READ' || action === 'UPDATE';
        if (resource === 'COMPANIES') return action === 'READ';
        return false;
      
      case 'CLIENT':
        if (resource === 'PRINTERS' || resource === 'SERVICE_ORDERS' || resource === 'REPORTS') {
          return action === 'READ';
        }
        return false;
      
      default:
        return false;
    }
  };

  return { can };
}
