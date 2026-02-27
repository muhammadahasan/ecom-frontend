import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, children, redirectTo = "/auth" }) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}
