
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     location: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
