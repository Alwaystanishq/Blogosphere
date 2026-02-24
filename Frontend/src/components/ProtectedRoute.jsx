import React from "react";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Checking authentication...</p>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
