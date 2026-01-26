
import express from "express";
import {
  getAllActiveJobs,
  applyForJob,
  myApplications,
} from "../controllers/customerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("customer"));

router.get("/jobs", getAllActiveJobs);
router.post("/apply", applyForJob);
router.get("/applications", myApplications);

export default router;


