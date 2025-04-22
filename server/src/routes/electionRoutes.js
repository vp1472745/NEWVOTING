import express from "express";
import {
    createElection,
    updateElection,
    deleteElection,
    getAllElections,
    getElectionById,

} from "../controller/electionController.js";
import { organizationProtect,Candidateprotect } from "../middlewares/authMiddleware.js";

const router = express.Router();



// Organization protected routes
router.post("/create",createElection);
router.put("/update/:id",organizationProtect,updateElection);
router.delete("/delete/:id",organizationProtect,deleteElection);
router.get("/all", organizationProtect, getAllElections);
router.get("/:id", organizationProtect, getElectionById);

export default router;