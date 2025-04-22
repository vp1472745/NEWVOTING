import Candidate from "../models/CandidateModel.js";
import Election from "../models/electionModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createCandidate = async (req, res) => {
  try {
    const {
      election,
      candidateName,
      candidateEmail,
      candidatePassword,
      candidateAddress,
      candidatePhone,
      candidateImage,
      candidatePayImage,
      candidateGender,
      candidateAge,
      candidateStatus,
      appliedPost,
    } = req.body;

    const candidateExists = await Candidate.findOne({ candidateEmail });
    if (candidateExists) {
      return res.status(400).json({ message: "Candidate already exists" });
    }

    const hashedPassword = await bcrypt.hash(candidatePassword, 10);
    const newCandidate = await Candidate.create({
      organization: req.organization._id,
      election,
      candidateName,
      candidateEmail,
      candidatePassword: hashedPassword,
      candidateAddress,
      candidatePhone,
      candidateImage,
      candidatePayImage,
      candidateGender,
      candidateAge,
      candidateStatus,
      appliedPost,
    });

    res.status(201).json({
      success: true,
      candidate: {
        _id: newCandidate._id,
        candidateName: newCandidate.candidateName,
        candidateEmail: newCandidate.candidateEmail,
        candidateImage: newCandidate.candidateImage,
        appliedPost: newCandidate.appliedPost,
        organization: newCandidate.organization,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCandidateByOrganization = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Check if the candidate belongs to the organization
    if (candidate.organization.toString() !== req.organization._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this candidate" });
    }

    const {
      candidateName,
      candidateEmail,
      candidatePassword,
      candidateAddress,
      candidatePhone,
      candidateImage,
      candidatePayImage,
      candidateGender,
      candidateAge,
      candidateStatus,
      appliedPost,
    } = req.body;

    candidate.candidateName = candidateName || candidate.candidateName;
    candidate.candidateEmail = candidateEmail || candidate.candidateEmail;

    if (candidatePassword && candidatePassword.trim() !== "") {
      const hashed = await bcrypt.hash(candidatePassword, 10);
      candidate.candidatePassword = hashed;
    }

    candidate.candidateAddress = candidateAddress || candidate.candidateAddress;
    candidate.candidatePhone = candidatePhone || candidate.candidatePhone;
    candidate.candidateImage = candidateImage || candidate.candidateImage;
    candidate.candidatePayImage =
      candidatePayImage || candidate.candidatePayImage;
    candidate.candidateGender = candidateGender || candidate.candidateGender;
    candidate.candidateAge = candidateAge || candidate.candidateAge;

    if (typeof candidateStatus === "boolean") {
      candidate.candidateStatus = candidateStatus;
    }

    candidate.appliedPost = appliedPost || candidate.appliedPost;

    const updated = await candidate.save();

    res.status(200).json({
      success: true,
      candidate: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCandidateSelf = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.candidate._id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const {
      candidateName,
      candidatePassword,
      candidateAddress,
      candidatePhone,
      candidateImage,
      candidateGender,
      candidateAge,
    } = req.body;

    if (candidateName) candidate.candidateName = candidateName;
    if (candidateAddress) candidate.candidateAddress = candidateAddress;
    if (candidatePhone) candidate.candidatePhone = candidatePhone;
    if (candidateImage) candidate.candidateImage = candidateImage;
    if (candidateGender) candidate.candidateGender = candidateGender;
    if (candidateAge) candidate.candidateAge = candidateAge;

    if (candidatePassword && candidatePassword.trim() !== "") {
      const hashed = await bcrypt.hash(candidatePassword, 10);
      candidate.candidatePassword = hashed;
    }

    const updated = await candidate.save();

    res.status(200).json({
      success: true,
      message: "Candidate profile updated successfully",
      candidate: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Check if the candidate belongs to the organization
    if (candidate.organization.toString() !== req.organization._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this candidate" });
    }

    await candidate.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginCandidate = async (req, res) => {
  try {
    const { candidateEmail, candidatePassword } = req.body;

    const candidate = await Candidate.findOne({ candidateEmail });
    if (!candidate) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(candidatePassword, candidate.candidatePassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: candidate._id, role: "candidate" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        candidateId: candidate._id, // ✅ Add this
        candidate: {
          _id: candidate._id,
          candidateName: candidate.candidateName,
          candidateEmail: candidate.candidateEmail,
          candidateImage: candidate.candidateImage,
          appliedPost: candidate.appliedPost,
        },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ organization: req.organization._id })
      .populate("election", "electionName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      candidates: candidates || [],
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkUpdateStatus = async (req, res) => {
  try {
    const { candidateStatus } = req.body;
    
    const result = await Candidate.updateMany(
      {}, 
      { $set: { candidateStatus } }
    );

    res.status(200).json({
      success: true,
      message: `Successfully updated status for ${result.modifiedCount} candidates`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Error in getCandidateById:", error);
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};


export const getAllElectionIdsForCandidate = async (req, res, next) => {
  try {
    const elections = await Election.find({}, "_id electionName")
      .sort({ createdAt: -1 });

    const electionIds = elections.map(e => ({
      id: e._id,
      name: e.electionName
    }));

    res.status(200).json({
      success: true,
      elections: electionIds
    });
  } catch (error) {
    console.error("Error fetching election IDs:", error);
    next(error);
  }
};