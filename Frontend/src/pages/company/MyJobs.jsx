import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export const MyJobs = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState("");
  const [editJob, setEditJob] = useState(null); // For edit modal
  const [editData, setEditData] = useState({ title: "", description: "", location: "" });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/company/jobs`, { credentials: "include" });
      if (res.status === 403) {
        const data = await res.json();
        setBlocked(true);
        setError(data.message || "Your account has been blocked by admin.");
        setJobs([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
        setBlocked(false);
      } else {
        setJobs([]);
        toast.error(data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (blocked) {
      toast.error("Your account is blocked. You cannot delete jobs.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`${API_URL}/api/company/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Job deleted successfully!");
        setJobs((prev) => prev.filter((job) => job._id !== jobId));
      } else {
        const data = await res.json();
        toast.error(data.message || "Error deleting job");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleEditClick = (job) => {
    setEditJob(job);
    setEditData({
      title: job.title,
      description: job.description,
      location: job.location,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/api/company/jobs/${editJob._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update job");
        return;
      }

      toast.success("Job updated successfully!");
      setJobs((prev) =>
        prev.map((job) => (job._id === editJob._id ? { ...job, ...editData } : job))
      );
      setEditJob(null);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <p className="text-gray-500 py-6">Loading jobs...</p>
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-red-600">
        <h2 className="text-2xl font-bold mb-2">Account Blocked</h2>
        <p>{error}</p>
        <p className="mt-2 text-sm text-gray-500">
          Please contact admin support for further assistance.
        </p>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-2">No Jobs Posted</h2>
        <p className="text-gray-500">You haven’t posted any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Jobs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-4 rounded shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-500">{job.location || "N/A"}</p>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                onClick={() => handleEditClick(job)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <Link
                to={`/company/applicants/${job._id}`}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Applicants
              </Link>

              <button
                onClick={() => handleDeleteJob(job._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-purple-600">
              Edit Job
            </h2>

            <input
              type="text"
              name="title"
              placeholder="Job Title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editData.title}
              onChange={handleEditChange}
            />

            <textarea
              name="description"
              placeholder="Job Description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editData.description}
              onChange={handleEditChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editData.location}
              onChange={handleEditChange}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditJob(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
