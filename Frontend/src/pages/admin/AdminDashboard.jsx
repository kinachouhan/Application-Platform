import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
} from "lucide-react";

export const AdminDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState({
    customers: 0,
    companies: 0,
    jobs: 0,
    applications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const usersRes = await fetch(`${API_URL}/api/admin/users`, {
        credentials: "include",
      });
      const users = await usersRes.json();

      const customers = users.filter((u) => u.role === "customer").length;
      const companies = users.filter((u) => u.role === "company").length;

      const jobsRes = await fetch(`${API_URL}/api/admin/jobs`, {
        credentials: "include",
      });
      const jobs = await jobsRes.json();

      const appsRes = await fetch(
        `${API_URL}/api/admin/applications`,
        { credentials: "include" }
      );
      const applications = await appsRes.json();

      setStats({
        customers,
        companies,
        jobs: jobs.length,
        applications: applications.length,
      });
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Customers",
      value: stats.customers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Companies",
      value: stats.companies,
      icon: Building2,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Jobs",
      value: stats.jobs,
      icon: Briefcase,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Applications",
      value: stats.applications,
      icon: FileText,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Overview of platform activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow-sm border 
            hover:shadow-md transition"
          >
            <div className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  {label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-800">
                  {value}
                </p>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-xl 
                bg-gradient-to-r ${color} text-white`}
              >
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Quick Actions
          </h2>
          <p className="text-sm text-gray-500">
            Manage platform resources quickly
          </p>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/customers"
            className="flex items-center justify-center gap-2 
            px-4 py-3 rounded-lg 
            bg-blue-600 text-white 
            hover:bg-blue-700 transition"
          >
            <Users size={18} />
            Customers
          </Link>

          <Link
            to="/admin/companies"
            className="flex items-center justify-center gap-2 
            px-4 py-3 rounded-lg 
            bg-green-600 text-white 
            hover:bg-green-700 transition"
          >
            <Building2 size={18} />
            Companies
          </Link>

          <Link
            to="/admin/jobs"
            className="flex items-center justify-center gap-2 
            px-4 py-3 rounded-lg 
            bg-yellow-600 text-white 
            hover:bg-yellow-700 transition"
          >
            <Briefcase size={18} />
            Jobs
          </Link>

          <Link
            to="/admin/applications"
            className="flex items-center justify-center gap-2 
            px-4 py-3 rounded-lg 
            bg-purple-600 text-white 
            hover:bg-purple-700 transition"
          >
            <FileText size={18} />
            Applications
          </Link>
        </div>
      </div>
    </div>
  );
};
