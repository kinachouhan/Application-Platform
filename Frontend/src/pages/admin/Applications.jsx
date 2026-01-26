import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Briefcase, User } from "lucide-react";

export const Applications = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    const res = await fetch(`${API_URL}/api/admin/applications`, {
      credentials: "include",
    });
    const data = await res.json();
    setApplications(data);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatus = async (id, status) => {
    await fetch(`${API_URL}/api/admin/application/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchApplications();
  };

  const statusBadge = (status) => {
    if (status === "selected") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="bg-white rounded-xl shadow border">
      <div className="p-5 sm:p-6 border-b">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Job Applications
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage candidate applications
        </p>
      </div>

 
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Job</th>
              <th className="px-6 py-3 text-left">Applicant</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {applications.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No applications found
                </td>
              </tr>
            )}

            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-400" />
                    <span className="font-medium">
                      {app.job ? app.job.title : "Job Deleted"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span>
                      {app.applicant?.name || "User Removed"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      disabled={app.status !== "pending"}
                      onClick={() => handleStatus(app._id, "selected")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 disabled:opacity-40"
                    >
                      <CheckCircle size={14} />
                      Select
                    </button>

                    <button
                      disabled={app.status !== "pending"}
                      onClick={() => handleStatus(app._id, "rejected")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 disabled:opacity-40"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {applications.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No applications found
          </p>
        )}

        {applications.map((app) => (
          <div
            key={app._id}
            className="border rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Job</p>
                <p className="font-semibold">
                  {app.job ? app.job.title : "Job Deleted"}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(
                  app.status
                )}`}
              >
                {app.status}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Applicant</p>
              <p className="font-medium">
                {app.applicant?.name || "User Removed"}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                disabled={app.status !== "pending"}
                onClick={() => handleStatus(app._id, "selected")}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-40"
              >
                <CheckCircle size={16} />
                Select
              </button>

              <button
                disabled={app.status !== "pending"}
                onClick={() => handleStatus(app._id, "rejected")}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-40"
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
