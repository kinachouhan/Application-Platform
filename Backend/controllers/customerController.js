
import {Job }from "../models/job.js";
import{ Application} from "../models/application.js";

export const getAllActiveJobs = async (req, res) => {
  const jobs = await Job.find({ isActive: true }).populate(
    "company",
    "name email"
  );
  res.json(jobs);
};



export const applyForJob = async (req, res) => {
  const { job, company, resume, coverNote } = req.body;

  const existingApplication = await Application.findOne({
    job,
    applicant: req.user._id,
  });

  if (existingApplication) {
    return res.status(400).json({
      message: "You have already applied for this job",
    });
  }

  const application = await Application.create({
    job,
    company,
    applicant: req.user._id,
    resume,
    coverNote,
  });

  res.status(201).json(application);
};



export const myApplications = async (req, res) => {
  const apps = await Application.find({
    applicant: req.user._id,
  }).populate({
    path: "job",
    populate: {
      path: "company",
      select: "name email",
    },
  });

  res.json(apps);
};
