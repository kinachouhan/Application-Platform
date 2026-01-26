import { useEffect, useState } from "react";

export const MyApplications = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customer/applications`, {
        credentials: "include",
      });
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <p className="text-gray-500 py-6">Loading applications...</p>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <p className="text-gray-500 py-6">You haven’t applied for any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-600 mb-2">My Applications</h2>

      <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Job</th>
              <th className="border px-4 py-2">Company</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{app.job?.title || "Job removed"}</td>
                <td className="border px-4 py-2">{app.job?.company?.name || "N/A"}</td>
                <td className="border px-4 py-2 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      app.status === "selected"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white p-4 rounded shadow flex flex-col gap-2"
          >
            <h3 className="text-lg font-semibold">{app.job?.title || "Job removed"}</h3>
            <p className="text-gray-500">Company: {app.job?.company?.name || "N/A"}</p>
            <p>
              Status:{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  app.status === "selected"
                    ? "bg-green-100 text-green-700"
                    : app.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
