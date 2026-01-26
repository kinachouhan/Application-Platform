import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicLayout = () => {
  const { authLoading, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

 
  if (isAuthenticated && user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "company") return <Navigate to="/company" replace />;
    if (user.role === "customer") return <Navigate to="/customer" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <Outlet />
      </div>
    </div>
  );
};
