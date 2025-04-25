import Voter from "../models/votersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Candidate from "../models/CandidateModel.js";

export const registerVoter = async (req, res) => {
  try {
    const {
      voterName,
      voterEmail,
      voterPassword,
      voterAddress,
      voterPhone,
      voterGender,
      voterAge,
    } = req.body;

    const voterExists = await Voter.findOne({ voterEmail });
    if (voterExists) {
      return res.status(400).json({ message: "Voter already exists" });
    }

    const hashedPassword = await bcrypt.hash(voterPassword, 10);
    const newVoter = await Voter.create({
      organization: req.organization._id, // Add organization from the authenticated organization
      voterName,
      voterEmail,
      voterPassword: hashedPassword,
      voterAddress,
      voterPhone,
      voterGender,
      voterAge,
      voterStatus: false, // Default status
      voterVoted: false, // Default voting status
    });

    res.status(201).json({
      success: true,
      voter: {
        _id: newVoter._id,
        voterName: newVoter.voterName,
        voterEmail: newVoter.voterEmail,
        organization: newVoter.organization,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find()
      .populate("organization", "orgName orgEmail") // Populate organization fields
      .sort({ createdAt: -1 });

    if (!voters || voters.length === 0) {
      return res.status(404).json({ success: false, message: "No voters found." });
    }

    res.status(200).json({
      success: true,
      voters,
    });
  } catch (error) {
    console.error("Error fetching voters:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVoterStatus = async (req, res) => {
  try {
    const { voterStatus } = req.body;
    const voter = await Voter.findById(req.params.id);

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    // Check if the voter belongs to the organization
    if (voter.organization.toString() !== req.organization._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this voter" });
    }

    voter.voterStatus = voterStatus;
    const updatedVoter = await voter.save();

    res.status(200).json({
      success: true,
      voter: {
        _id: updatedVoter._id,
        voterName: updatedVoter.voterName,
        voterEmail: updatedVoter.voterEmail,
        voterStatus: updatedVoter.voterStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    // Check if the voter belongs to the organization
    if (voter.organization.toString() !== req.organization._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this voter" });
    }

    await voter.deleteOne();

    res.status(200).json({
      success: true,
      message: "Voter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const voterlogin = async (req, res) => {
  try {
    const { voterEmail, voterPassword } = req.body;

    const voter = await Voter.findOne({ voterEmail });
    if (!voter) {
      return res.status(400).json({ message: "Voter not found" });
    }

    const isPasswordValid = await bcrypt.compare(voterPassword, voter.voterPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: voter._id, email: voter.voterEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      voter: {
        _id: voter._id,
        name: voter.voterName,
        email: voter.voterEmail,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getVoterById = async (req, res) => {
  try {
    const voterId = req.params.id;
    const voter = await Voter.findById(voterId);
    
    if (!voter) {
      return res.status(404).json({ success: false, message: "Voter not found" });
    }

    res.status(200).json({ success: true, voter });
  } catch (error) {
    console.error("Error fetching voter:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateVoterProfile = async (req, res) => {
  try {
    const voterId = req.params.id;
    const {
      voterName,
      voterEmail,
      voterPhone,
      voterAddress,
      voterGender,
      voterAge,
    } = req.body;

    const updatedVoter = await Voter.findByIdAndUpdate(
      voterId,
      {
        voterName,
        voterEmail,
        voterPhone,
        voterAddress,
        voterGender,
        voterAge,
      },
      { new: true, runValidators: true }
    );

    if (!updatedVoter) {
      return res.status(404).json({ success: false, message: "Voter not found" });
    }

    res.status(200).json({
      success: true,
      voter: updatedVoter,
      message: "Voter profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating voter profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





export const getAllCandidates = async (req, res) => {
  try {
    // Get voter ID from the authenticated user (assuming you set req.user in voterprotect middleware)
    const voterId = req.user && req.user.id ? req.user.id : null;
    if (!voterId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Voter not found in request." });
    }

    // Find the voter to get their organization
    const voter = await Voter.findById(voterId);
    if (!voter || !voter.organization) {
      return res.status(404).json({ success: false, message: "Voter or organization not found." });
    }

    // Fetch candidates for the voter's organization
    const candidates = await Candidate.find({ organization: voter.organization })
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

// Controller for voter to get all candidates of their organization
export const getCandidatesForVoter = async (req, res) => {
  try {
    // Get voter ID from JWT (set by voterprotect middleware)
    const voterId = req.user && req.user.id ? req.user.id : null;
    if (!voterId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Voter not found in request." });
    }

    // Find the voter to get their organization
    const voter = await Voter.findById(voterId);
    if (!voter || !voter.organization) {
      return res.status(404).json({ success: false, message: "Voter or organization not found." });
    }

    // Fetch candidates for the voter's organization
    const candidates = await Candidate.find({ organization: voter.organization })
      .populate("election", "electionName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      candidates: candidates || [],
    });
  } catch (error) {
    console.error("Error fetching candidates for voter:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVoterProfile = async (req, res) => {
  try {
    // Get voter from auth middleware
    const voter = await Voter.findById(req.user._id)
      .populate('organization', '_id orgName')
      .select('-voterPassword');

    if (!voter) {
      return res.status(404).json({ 
        success: false,
        message: "Voter not found" 
      });
    }

    res.status(200).json({
      success: true,
      voter: {
        _id: voter._id,
        name: voter.voterName,
        email: voter.voterEmail,
        organizationId: voter.organization._id,
        organizationName: voter.organization.orgName,
        voterStatus: voter.voterStatus,
        voterVoted: voter.voterVoted
      }
    });
  } catch (error) {
    console.error("Error in getVoterProfile:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

