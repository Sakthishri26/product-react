import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

function ProtectedRoute() {
  const { token, checking } = useAuth();

  if (checking) {
    return <Spinner />;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;