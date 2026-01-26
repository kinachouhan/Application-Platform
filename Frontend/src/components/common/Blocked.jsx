import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

export const Blocked = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        🚫 Account Blocked
      </h1>
      <p className="text-gray-600">
        Your account has been blocked by admin.
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Please contact support.
      </p>
    </div>
  );
};
