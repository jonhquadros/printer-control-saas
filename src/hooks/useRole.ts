import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";

export function useRole() {
  const { user, loading } = useAuth();
  
  return {
    role: user?.role,
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER',
    isTechnician: user?.role === 'TECHNICIAN',
    isClient: user?.role === 'CLIENT',
    isAdminOrAbove: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isGlobal: user?.role === 'SUPER_ADMIN' || user?.role === 'TECHNICIAN' || user?.role === 'MANAGER',
    loading
  };
}
