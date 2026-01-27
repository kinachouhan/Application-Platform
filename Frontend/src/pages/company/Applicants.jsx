import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, Check, X } from "lucide-react";

export const Applicants = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/company/applications/${jobId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatus = async (appId, status) => {
    const res = await fetch(
      `${API_URL}/api/company/application/${appId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    if (res.ok) {
      fetchApplicants();
    } else {
      const data = await res.json();
      alert(data.message || "Error updating status");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="text-gray-500">Loading applicants...</p>
      </div>
    );
  }


  if (applicants.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users size={28} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-600">Applicants</h2>
        </div>
        <p className="text-gray-500">No applicants yet for this job.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    
      <div className="flex items-center gap-2">
        <Users size={28} className="text-purple-600" />
        <h2 className="text-2xl font-bold text-purple-600">Applicants</h2>
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {applicants.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{a.applicant?.name}</td>
                <td className="px-4 py-3">{a.applicant?.email}</td>
                <td className="px-4 py-3">{a.coverNote || "-"}</td>

                <td className="px-4 py-3 font-semibold">
                  {a.status === "pending" && (
                    <span className="text-yellow-500">Pending</span>
                  )}
                  {a.status === "selected" && (
                    <span className="text-green-600">Selected</span>
                  )}
                  {a.status === "rejected" && (
                    <span className="text-red-600">Rejected</span>
                  )}
                </td>

                <td className="px-4 py-3 flex gap-2">
                  <button
                    disabled={a.status !== "pending"}
                    onClick={() => handleStatus(a._id, "selected")}
                    className="flex items-center gap-1 px-3 py-1.5
                    bg-green-500 text-white rounded-lg
                    hover:bg-green-600 disabled:opacity-50 transition"
                  >
                    <Check size={14} /> Select
                  </button>

                  <button
                    disabled={a.status !== "pending"}
                    onClick={() => handleStatus(a._id, "rejected")}
                    className="flex items-center gap-1 px-3 py-1.5
                    bg-red-500 text-white rounded-lg
                    hover:bg-red-600 disabled:opacity-50 transition"
                  >
                    <X size={14} /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {applicants.map((a) => (
          <div
            key={a._id}
            className="bg-white rounded-xl shadow p-4 space-y-3"
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                {a.applicant?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {a.applicant?.email}
              </p>
            </div>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Note:</span>{" "}
              {a.coverNote || "-"}
            </p>

            <div className="text-sm font-semibold">
              Status:{" "}
              {a.status === "pending" && (
                <span className="text-yellow-500">Pending</span>
              )}
              {a.status === "selected" && (
                <span className="text-green-600">Selected</span>
              )}
              {a.status === "rejected" && (
                <span className="text-red-600">Rejected</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                disabled={a.status !== "pending"}
                onClick={() => handleStatus(a._id, "selected")}
                className="flex-1 flex items-center justify-center gap-1
                px-3 py-2 bg-green-500 text-white rounded-lg
                hover:bg-green-600 disabled:opacity-50 transition text-sm"
              >
                <Check size={14} /> Select
              </button>

              <button
                disabled={a.status !== "pending"}
                onClick={() => handleStatus(a._id, "rejected")}
                className="flex-1 flex items-center justify-center gap-1
                px-3 py-2 bg-red-500 text-white rounded-lg
                hover:bg-red-600 disabled:opacity-50 transition text-sm"
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
