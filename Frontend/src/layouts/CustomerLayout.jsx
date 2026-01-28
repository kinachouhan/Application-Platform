import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { TbCircleLetterCFilled } from "react-icons/tb";

export const CustomerLayout = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const links = [
    { name: "Dashboard", path: "/job-seeker/dashboard" },
    { name: "My Applications", path: "/job-seeker/applications" },
    { name: "Profile", path: "/job-seeker/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

  
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md flex flex-col transform transition-transform duration-300 z-30
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <div className="p-6 border-b flex items-center gap-2">
          <TbCircleLetterCFilled size={30} className="text-purple-600" />
          <span className="text-2xl font-bold">Cargofirst</span>
        </div>

        <div className="pt-6 px-6 text-lg font-semibold text-gray-700">
          Customer Panel
        </div>

  
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-purple-600 text-white font-semibold shadow"
                    : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

    
        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"
        >
          Logout
        </button>
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col">
      
        <header className="flex items-center justify-between bg-white shadow-sm px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl text-gray-800"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Customer Panel
          </h1>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
