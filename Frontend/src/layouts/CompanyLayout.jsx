import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { Briefcase, PlusCircle, Home, Menu, X } from "lucide-react";
import { TbCircleLetterCFilled } from "react-icons/tb";

export const CompanyLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };
  
  const links = [
    {
      name: "Dashboard",
      path: "/company/dashboard",
      icon: <Home size={18} />,
      active: "bg-blue-600 text-white",
    },
    {
      name: "My Jobs",
      path: "/company/my-jobs",
      icon: <Briefcase size={18} />,
      active: "bg-green-600 text-white",
    },
    {
      name: "Create Job",
      path: "/company/create-job",
      icon: <PlusCircle size={18} />,
      active: "bg-yellow-500 text-white",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative`}
      >
        <div className="flex flex-col h-full">

          <div className="p-6 border-b flex items-center gap-3">
            <TbCircleLetterCFilled size={32} className="text-purple-600" />
            <span className="text-2xl font-bold text-gray-800">
              Cargofirst
            </span>
          </div>

          <p className="px-6 pt-5 pb-3 text-sm uppercase tracking-wider text-gray-500">
            Company Panel
          </p>
          <nav className="flex-1 px-4 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition
                  ${
                    isActive
                      ? link.active
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="m-4 py-2.5 rounded-lg
            bg-red-500 hover:bg-red-600
            text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">

    
        <header className="md:hidden sticky top-0 z-20
          flex items-center justify-between
          bg-white shadow px-4 py-3"
        >
          <button onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>

          <h1 className="text-lg font-semibold text-gray-800">
            Company Panel
          </h1>
        </header>

 
        <main className="flex-1 p-4 md:p-6">
          <div className="bg-white rounded-xl shadow p-4 md:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
