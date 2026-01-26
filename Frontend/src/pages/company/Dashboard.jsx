import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const CompanyDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    jobs: 0,
    applicants: 0,
  });

  const fetchStats = async () => {
    try {
      const resJobs = await fetch(`${API_URL}/api/company/jobs`, {
        credentials: "include",
      });

      if (resJobs.status === 401) {
        dispatch(logout());
        navigate("/login");
        return;
      }

      if (resJobs.status === 403) {
        navigate("/blocked");
        return;
      }

      if (!resJobs.ok) {
        toast.error("Failed to fetch jobs");
        return;
      }

      const jobs = await resJobs.json();
      let totalApplicants = 0;

      for (let job of jobs) {
        const resApps = await fetch(
          `${API_URL}/api/company/applications/${job._id}`,
          { credentials: "include" }
        );

        if (resApps.status === 401) {
          dispatch(logout());
          navigate("/login");
          return;
        }

        if (resApps.status === 403) {
          navigate("/blocked");
          return;
        }

        if (!resApps.ok) {
          toast.error("Failed to fetch applicants");
          return;
        }

        const apps = await resApps.json();
        totalApplicants += apps.length;
      }

      setStats({ jobs: jobs.length, applicants: totalApplicants });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-2">
        <Briefcase size={30} className="text-purple-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
          Company Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600
          text-white p-5 sm:p-6 rounded-xl shadow-md
          flex items-center justify-between"
        >
          <div>
            <p className="text-blue-100 uppercase font-semibold text-xs sm:text-sm">
              Jobs Posted
            </p>
            <p className="text-3xl sm:text-4xl font-bold mt-1">
              {stats.jobs}
            </p>
          </div>
          <Briefcase size={36} className="opacity-80" />
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600
          text-white p-5 sm:p-6 rounded-xl shadow-md
          flex items-center justify-between"
        >
          <div>
            <p className="text-green-100 uppercase font-semibold text-xs sm:text-sm">
              Total Applicants
            </p>
            <p className="text-3xl sm:text-4xl font-bold mt-1">
              {stats.applicants}
            </p>
          </div>
          <Users size={36} className="opacity-80" />
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-purple-600">
          Quick Actions
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/company/create-job"
            className="flex items-center justify-center gap-2
            px-5 py-3 bg-green-500 text-white rounded-lg
            hover:bg-green-600 transition font-medium"
          >
            <PlusCircle size={18} /> Create Job
          </Link>

          <Link
            to="/company/my-jobs"
            className="flex items-center justify-center gap-2
            px-5 py-3 bg-blue-500 text-white rounded-lg
            hover:bg-blue-600 transition font-medium"
          >
            <Briefcase size={18} /> My Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};
