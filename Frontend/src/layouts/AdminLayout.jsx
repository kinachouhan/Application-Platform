import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { TbCircleLetterCFilled } from "react-icons/tb";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      <aside
        className={`fixed inset-y-0 left-0 w-64 
        bg-gradient-to-b from-slate-900 to-slate-800 
        text-slate-100 transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative`}
      >
        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 pb-6 border-b border-slate-700">
              <TbCircleLetterCFilled size={34} className="text-purple-500" />
              <span className="text-2xl font-bold tracking-wide">
                Cargofirst
              </span>
            </div>

            <p className="mt-6 mb-4 text-sm uppercase tracking-wider text-slate-400">
              Admin Panel
            </p>

            <ul className="space-y-2">
              {[
                { to: "/admin", label: "Dashboard" },
                { to: "/admin/customers", label: "Customers" },
                { to: "/admin/companies", label: "Companies" },
                { to: "/admin/jobs", label: "Jobs" },
                { to: "/admin/applications", label: "Applications" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={handleLinkClick}
                    className="block px-4 py-2 rounded-lg
                    text-slate-300 hover:text-white
                    hover:bg-slate-700 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 
            text-white py-2.5 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">

        <header
          className="fixed top-0 left-0 right-0 z-20
          flex items-center justify-between
          bg-white shadow-sm px-4 py-3
          md:static md:hidden"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl text-slate-800"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-slate-800">
            Admin Panel
          </h1>
        </header>

        <main className="flex-1 p-6 pt-20 md:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
