import express from "express";
import {
  getAllUsers,
  getAllJobs,
  getAllApplications,
  blockUser,
  deleteJob,
  updateJob,
  updateApplicationStatusByAdmin
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.patch("/user/:id", blockUser);

router.get("/jobs", getAllJobs);
router.put("/job/:id", updateJob);


router.get("/applications", getAllApplications);
router.patch("/application/:id", updateApplicationStatusByAdmin);

router.delete(
  "/job/:id",
  protect,
  authorize("admin"),
  deleteJob
);

export default router;
