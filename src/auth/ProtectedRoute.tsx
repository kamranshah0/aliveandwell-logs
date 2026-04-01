import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import type { JSX } from "react";
import AuthenticationLoading from "@/components/molecules/AuthenticationLoading";

export function ProtectedRoute({
  children,
  permission,
}: {
  children: JSX.Element;
  permission?: string;
}) {
  const {
    isAuthenticated,
    isAuthReady,
    permissions,
  } = useAuth();

  // ⏳ wait until auth resolved
  if (!isAuthReady) return <AuthenticationLoading/>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
