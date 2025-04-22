import Voter from "../models/votersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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