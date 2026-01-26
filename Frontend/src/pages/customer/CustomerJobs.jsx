import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const CustomerJobs = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationText, setApplicationText] = useState("");

  const fetchJobs = async () => {
  try {
    const resJobs = await fetch(`${API_URL}/api/customer/jobs`, {
      credentials: "include",
    });
    const jobsData = await resJobs.json();
    setJobs(Array.isArray(jobsData) ? jobsData : []);

    const resApps = await fetch(`${API_URL}/api/customer/applications`, {
      credentials: "include",
    });
    const appsData = await resApps.json();

    const appliedJobIds = Array.isArray(appsData)
      ? appsData.filter((app) => app.job).map((app) => app.job._id)
      : [];

    setAppliedJobs(appliedJobIds);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch jobs or applications");
  }
};


  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (job) => {
    try {
      const res = await fetch(`${API_URL}/api/customer/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: job._id,
          company: job.company?._id,
          resume: "My Resume URL",
          coverNote: applicationText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error applying");
        return;
      }

      toast.success("Applied successfully!");
      setAppliedJobs((prev) => [...prev, job._id]);
      setSelectedJob(null);
      setApplicationText("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-purple-600">Available Jobs</h1>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const isApplied = appliedJobs.includes(job._id);

          return (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-500 mb-1 font-medium">{job.company?.name || "Company"}</p>
                <p className="text-gray-400">{job.location || "Location"}</p>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                disabled={isApplied}
                className={`mt-4 px-4 py-2 rounded-lg font-semibold text-white transition ${
                  isApplied
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isApplied ? "Applied" : "Apply"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">
              Apply for {selectedJob.title}
            </h2>

            <textarea
              rows={4}
              placeholder="Write a short note"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setApplicationText("");
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(selectedJob)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
