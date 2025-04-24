import express from "express";
import { voterlogin , getVoterById ,updateVoterProfile,getCandidatesForVoter} from "../controller/voterController.js";
import { voterprotect } from "../middlewares/authMiddleware.js";

const router = express.Router();
// Remove voterprotect middleware from the login route
router.post("/login",voterlogin);
router.get('/candidates', voterprotect, getCandidatesForVoter);
router.get("/:id", getVoterById);
router.put('/:id', updateVoterProfile);

export default router;