import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, firebaseUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we have a firebaseUser but no profile, and we're not loading anymore, 
  // it means the profile is missing or failed to load.
  if (!user) {
    // Optionally redirect to a profile completion page or just allow through if appropriate
    // For now, let's redirect to login to be safe, or show an error
    return <Navigate to="/login" state={{ error: "PROFILE_MISSING" }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
