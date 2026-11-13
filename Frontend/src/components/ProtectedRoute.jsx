import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="page-status" role="status">Opening your stories…</p>;

  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
}

export default ProtectedRoute;