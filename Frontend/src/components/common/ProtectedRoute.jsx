import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, isBlocked, authLoading } = useSelector(
    (state) => state.auth
  );

  if (authLoading) return <div>Loading...</div>;

  // 🚫 Blocked users → blocked page ONLY
  if (isBlocked) {
    return <Navigate to="/blocked" replace />;
  }

  // ❌ Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
