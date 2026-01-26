import { useState } from "react";
import { toast } from "react-hot-toast";
import { Briefcase, Ban } from "lucide-react";

export const CreateJob = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (blocked) {
      toast.error("Your account is blocked. You cannot create jobs.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/company/jobs`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 403) {
        const data = await res.json();
        setBlocked(true);
        setError(data.message || "Your company account is blocked by admin.");
        toast.error("Account blocked by admin");
        return;
      }

      if (res.ok) {
        toast.success("Job created successfully!");
        setFormData({ title: "", description: "", location: "" });
      } else {
        const data = await res.json();
        toast.error(data.message || "Error creating job");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Check console for details.");
    }
  };

  
  if (blocked) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full">
            <Ban size={36} className="text-red-600" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-red-600">
          Account Blocked
        </h2>

        <p className="text-gray-600 mt-3">
          {error || "Your account has been blocked by admin."}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          You are not allowed to create jobs at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
 
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Briefcase size={26} className="text-purple-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-purple-600">
          Create Job
        </h2>
      </div>

     
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5
          focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          rows="4"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5
          focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5
          focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2
          px-4 py-2.5 bg-green-500 text-white rounded-lg
          hover:bg-green-600 transition font-medium"
        >
          <Briefcase size={18} /> Create Job
        </button>
      </form>
    </div>
  );
};
