import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    actionLoading,
    isError,
    message,
    isAuthenticated,
    isBlocked,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetAuthState());
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (isBlocked) {
      navigate("/blocked", { replace: true });
      return;
    }

    if (isAuthenticated && user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [isBlocked, isAuthenticated, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-gray-100 to-zinc-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fadeIn">
      
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Login to your account
          </p>
        </div>

        {isError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
            {message}
          </div>
        )}

       
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={actionLoading}
            className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white transition
              ${
                actionLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900 active:scale-[0.99]"
              }`}
          >
            {actionLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        
        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-black hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
