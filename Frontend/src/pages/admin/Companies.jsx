import { useEffect, useState } from "react";
import { UserCheck, UserX } from "lucide-react";

export const Companies = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        credentials: "include",
      });
      const data = await res.json();
      setCompanies(data.filter((u) => u.role === "company"));
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleBlock = async (id, isBlocked) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/user/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error updating status");
        return;
      }

      setCompanies((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isBlocked: !isBlocked } : c
        )
      );
    } catch (err) {
      console.error("Error updating company status:", err);
      alert("Something went wrong while updating status");
    }
  };

  

  return (
    <div className="bg-white rounded-xl shadow border">
      <div className="p-5 sm:p-6 border-b">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Companies
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage all registered company accounts
        </p>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {companies.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No companies found
                </td>
              </tr>
            )}

            {companies.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-gray-600">{c.email}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleBlock(c._id, c.isBlocked)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs transition ${
                      c.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {c.isBlocked ? (
                      <UserCheck size={14} />
                    ) : (
                      <UserX size={14} />
                    )}
                    {c.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {companies.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No companies found
          </p>
        )}

        {companies.map((c) => (
          <div
            key={c._id}
            className="border rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-semibold">{c.name}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  c.isBlocked
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {c.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium break-all">
                {c.email}
              </p>
            </div>

            <button
              onClick={() => handleBlock(c._id, c.isBlocked)}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white text-sm transition ${
                c.isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {c.isBlocked ? (
                <>
                  <UserCheck size={16} /> Unblock Company
                </>
              ) : (
                <>
                  <UserX size={16} /> Block Company
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
