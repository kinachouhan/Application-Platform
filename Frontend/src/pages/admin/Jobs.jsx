import { useEffect, useState } from "react";
import { Trash2, Briefcase, MapPin, Building2 } from "lucide-react";

export const Jobs = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/jobs`, {
        credentials: "include",
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/job/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error deleting job");
        return;
      }

      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Something went wrong while deleting the job");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold text-gray-800">Jobs</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage all job postings
        </p>
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {jobs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No jobs available
                </td>
              </tr>
            )}

            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">
                  {job.title}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {job.company?.name || "Unknown Company"}
                </td>
                <td className="px-6 py-4">
                  {job.location || "N/A"}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs transition"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      <div className="md:hidden p-4 space-y-4">
        {jobs.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No jobs available
          </p>
        )}

        {jobs.map((job) => (
          <div
            key={job._id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase size={16} className="text-gray-500" />
              {job.title}
            </h3>

            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Building2 size={14} />
                {job.company?.name || "Unknown Company"}
              </p>

              <p className="flex items-center gap-2">
                <MapPin size={14} />
                {job.location || "N/A"}
              </p>
            </div>

            <button
              onClick={() => handleDelete(job._id)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
            >
              <Trash2 size={16} />
              Delete Job
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
