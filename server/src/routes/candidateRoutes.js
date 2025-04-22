import express from "express";
import {
  createCandidate,
  updateCandidateByOrganization,
  updateCandidateSelf,
  deleteCandidate,
  loginCandidate,
  getAllCandidates,
  bulkUpdateStatus,
  getCandidateById,
  getAllElectionIdsForCandidate
} from "../controller/candidateController.js";

import {
  Candidateprotect,
  organizationProtect,
} from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.post("/register", organizationProtect, createCandidate);
router.post("/login", loginCandidate);
router.put("/update", Candidateprotect, updateCandidateSelf);
router.put("/update/:id", organizationProtect, updateCandidateByOrganization);
router.delete("/:id", organizationProtect, deleteCandidate);
router.get("/all", organizationProtect, getAllCandidates);
router.put('/bulk-status', organizationProtect, bulkUpdateStatus);
router.get("/:id", Candidateprotect, getCandidateById);
router.get("/election/all", Candidateprotect, getAllElectionIdsForCandidate);

export default router;
