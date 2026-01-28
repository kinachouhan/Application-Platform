
import {Job} from "../models/job.js";
import {Application} from "../models/application.js";

export const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    company: req.user._id,
  });

  res.status(201).json(job);
};

export const getMyJobs = async (req, res) => {
  const jobs = await Job.find({ company: req.user._id });
  res.json(jobs);
};


export const getApplicants = async (req, res) => {
  const applications = await Application.find({
    job: req.params.jobId,
  }).populate("applicant", "name email");

  res.json(applications);
};


export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["selected", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (
      !application.job ||
      application.job.company.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Status updated", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.company) {
      return res.status(400).json({ message: "Job has no company assigned" });
    }

    
    if (!req.user || job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }
    
    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete Job Error:", err.message);
    res.status(500).json({ message: "Server error while deleting job" });
  }
};



export const updateJob = async (req, res) => {
  try {
    const { id } = req.params; 
    const { title, description, location } = req.body;
   
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (title) job.title = title;
    if (description) job.description = description;
    if (location) job.location = location;

    await job.save();

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

