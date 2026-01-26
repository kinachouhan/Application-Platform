
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: String,
    coverNote: String,
    status: {
      type: String,
      enum: ["pending", "selected", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);