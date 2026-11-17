import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";
import AccessDenied from "../pages/AccessDenied";


function ProtectedRoute({ permission }) {
  const { token, user, checking, hasPermission } = useAuth();

  if (checking) {
    return <Spinner />;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (permission) {
    if (!user) {
      return (
        <p className="text-center text-red-600">
          Can't load your account. Is the API running?
        </p>
      );
    }
    if (!hasPermission(permission)) {
      return <AccessDenied />;
    }
  }
  return <Outlet />;
}

export default ProtectedRoute;