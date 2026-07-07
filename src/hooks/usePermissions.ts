import { useRole } from "./useRole";

export type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
export type Resource = 'PRINTERS' | 'SERVICE_ORDERS' | 'COMPANIES' | 'USERS' | 'REPORTS';

export function usePermissions() {
  const { role, isSuperAdmin } = useRole();

  const can = (action: Action, resource: Resource): boolean => {
    if (isSuperAdmin) return true;

    switch (role) {
      case 'ADMIN':
        if (resource === 'COMPANIES') return action === 'READ' || action === 'UPDATE';
        return true; // Admin can do almost everything else within their company
      
      case 'TECHNICIAN':
        if (resource === 'SERVICE_ORDERS') return action === 'READ' || action === 'UPDATE';
        if (resource === 'PRINTERS') return action === 'READ' || action === 'UPDATE';
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
