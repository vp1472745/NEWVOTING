import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Organization from "../models/organizationModel.js";
import Candidate from "../models/CandidateModel.js";
import Voter from "../models/votersModel.js";

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



export const voterprotect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach voter info to req.user
      req.user = { id: decoded.id, email: decoded.email };
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};


export const pollingProtect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a candidate
    const candidate = await Candidate.findById(decoded.key);
    if (candidate) {
      req.user = candidate;
      req.userType = 'candidate';
      return next();
    }

    // Check if it's a voter
    const voter = await Voter.findById(decoded.key);
    if (voter) {
      req.user = voter;
      req.userType = 'voter';
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "User not found"
    });

  } catch (error) {
    console.error("Polling protect error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};