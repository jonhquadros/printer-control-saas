import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = "/unauthorized" 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a generic loading spinner if not handled higher up
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
