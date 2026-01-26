import { User } from "../models/user.js";
import { Job } from "../models/job.js";
import { Application } from "../models/application.js";



export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: "User status updated", user });
};


export const getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate("company", "name email");
  res.json(jobs);
};

export const updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json(job);
};


export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    await Application.deleteMany({ job: jobId });

    await Job.findByIdAndDelete(jobId);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting job" });
  }
};


export const getAllApplications = async (req, res) => {
  const applications = await Application.find()
    .populate("job", "title location")
    .populate("applicant", "name email");

  res.json(applications);
};

export const updateApplicationStatusByAdmin = async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  application.status = status;
  await application.save();

  res.json(application);
};
