import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";

export function useRole() {
  const { user, loading } = useAuth();
  
  return {
    role: user?.role,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    isTechnician: user?.role === 'TECHNICIAN',
    isClient: user?.role === 'CLIENT',
    loading
  };
}
