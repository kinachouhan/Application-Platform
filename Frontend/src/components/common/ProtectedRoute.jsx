import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, role }) => {
  const { user, isBlocked, authLoading } = useSelector(
    (state) => state.auth
  );


  if (authLoading) return null;


  if (isBlocked) {
    return <Navigate to="/blocked" replace />;
  }

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "company") return <Navigate to="/company" replace />;
    if (user.role === "job-seeker") return <Navigate to="/customer" replace />;

    return <Navigate to="/login" replace />;
  }

  return children;
};
