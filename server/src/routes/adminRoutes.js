import express from "express";
import {
  regesterAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllOrg,
  getOrgById,
  updateOrg,
  deleteOrg,
  createOrg,
  updateOrgStatus,
  sendOrgCredentials
  
} from "../controller/adminController.js";
import { adminProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin Routes");
});

router.post("/register", regesterAdmin);
router.post("/login", loginAdmin);
router.post("/logout", adminProtect, logoutAdmin);
router.get("/profile", adminProtect, getAdminProfile);
router.put("/profile", adminProtect, updateAdminProfile);
router.post("/org", adminProtect, createOrg);
router.get("/org", adminProtect, getAllOrg);
router.get("/org/:id", adminProtect, getOrgById);
router.put("/org/:id",  adminProtect, updateOrg);
router.patch("/org/:id", adminProtect, updateOrgStatus);
router.delete("/org/:id", adminProtect, deleteOrg);
router.post("/send-org-credentials",adminProtect, sendOrgCredentials);


export default router;
