import express from "express";
import {
  createJob,
  getMyJobs,
  getApplicants,
  updateApplicationStatus,
  deleteJob,
  updateJob,
} from "../controllers/companyController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("company"));

router.post("/jobs", createJob);
router.get("/jobs", getMyJobs);
router.get("/applications/:jobId", getApplicants);
router.patch("/application/:id", updateApplicationStatus);




router.delete("/jobs/:id", deleteJob);

router.patch("/jobs/:id", protect, updateJob);



export default router;
