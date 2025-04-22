import express from "express";
import {
  loginOrganization,
  logoutOrganization,
  getOrganization,
  updateOrganization,
  registerVoter,
  getAllVoters,
  getVoterById,
  updateVoter,
  updateVoterStatus,
  deleteVoter,
} from "../controller/organizationController.js";
import { organizationProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Organization Authentication Routes
router.post("/login", loginOrganization);
router.post("/logout", logoutOrganization);

// Organization Profile Routes
router.get("/", organizationProtect, getOrganization);
router.put("/", organizationProtect, updateOrganization);

// Voter Management Routes
router.post("/voter/register", organizationProtect, registerVoter);
router.get("/voter/all", organizationProtect, getAllVoters);
router.get("/voter/:id", organizationProtect, getVoterById);
router.put("/voter/update/:id", organizationProtect, updateVoter);
router.put("/voter/status/:id", organizationProtect, updateVoterStatus);
router.delete("/voter/:id", organizationProtect, deleteVoter);

export default router;
