import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Organization from "../models/organizationModel.js";
import Candidate from "../models/CandidateModel.js";

export const adminProtect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const error = new Error("Token is missing");
      error.status = 401;
      next(error);
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      const error = new Error("Token is invalid");
      error.status = 401;
      next(error);
      return;
    }

    // check if admin exists with the id in the toke
    const admin = await Admin.findById(decoded.key);
    if (!admin) {
      const error = new Error("Admin not found");
      error.status = 401;
      next(error);
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

export const organizationProtect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Organization token is missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const organization = await Organization.findById(decoded.key);

      if (!organization) {
        return res.status(401).json({
          success: false,
          message: "Organization not found",
        });
      }

      // Set the entire organization object in req
      req.organization = organization;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const Candidateprotect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const error = new Error("Token is missing");
      error.status = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "candidate") {
      const error = new Error("Unauthorized - Invalid token or role");
      error.status = 401;
      return next(error);
    }

    const candidate = await Candidate.findById(decoded.id).select(
      "-candidatePassword"
    );
    if (!candidate) {
      const error = new Error("Candidate not found");
      error.status = 401;
      return next(error);
    }

    req.candidate = candidate;
    next();
  } catch (error) {
    next(error);
  }
};

export const eitherProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const organization = await Organization.findById(decoded.id);
    const candidate = await Candidate.findById(decoded.id);

    if (organization || candidate) {
      req.user = organization || candidate;
      next();
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
