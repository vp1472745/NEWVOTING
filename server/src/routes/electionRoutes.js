import express from "express";
import {
    createElection,
    updateElection,
    deleteElection,
    getAllElections,
    getElectionById,
    getActiveElections // Add this import
} from "../controller/electionController.js";
import { organizationProtect, Candidateprotect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add this new route
router.get('/active', getActiveElections);



// Organization protected routes
router.post("/create", organizationProtect, createElection);
router.put("/update/:id", organizationProtect, updateElection);
router.delete("/delete/:id", organizationProtect, deleteElection);
router.get("/all",organizationProtect, getAllElections);
router.get("/:id", getElectionById);

export default router;