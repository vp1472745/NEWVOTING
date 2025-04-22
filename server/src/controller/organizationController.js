import Organization from "../models/organizationModel.js";
import Voter from "../models/votersModel.js";
import bcrypt from "bcryptjs";
import genAuthToken from "../config/auth.js";

// Organization Authentication
export const loginOrganization = async (req, res) => {
  try {
    const { orgEmail, orgPassword } = req.body;
    const organization = await Organization.findOne({ orgEmail });

    if (organization && (await bcrypt.compare(orgPassword, organization.orgPassword))) {
      const token = await genAuthToken(organization._id, res);
      res.status(200).json({
        success: true,
        user: {
          _id: organization._id,
          orgName: organization.orgName,
          orgEmail: organization.orgEmail,
          orgPhone: organization.orgPhone,
          orgLogo: organization.orgLogo,
          orgDescription: organization.orgDescription,
          orgWebsite: organization.orgWebsite,
          orgType: organization.orgType,
          orgStatus: organization.orgStatus,
        },
        token
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutOrganization = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.organization._id).select("-orgPassword");
    if (organization) {
      res.status(200).json({ success: true, organization });
    } else {
      res.status(404).json({ message: "Organization not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const {
      orgName,
      orgEmail,
      orgPhone,
      orgLogo,
      orgDescription,
      orgWebsite,
      orgType,
      orgStatus,
      orgAddress,
    } = req.body;

    const organization = await Organization.findById(req.organization._id);

    if (organization) {
      organization.orgName = orgName || organization.orgName;
      organization.orgEmail = orgEmail || organization.orgEmail;
      organization.orgPhone = orgPhone || organization.orgPhone;
      organization.orgLogo = orgLogo || organization.orgLogo;
      organization.orgDescription = orgDescription || organization.orgDescription;
      organization.orgWebsite = orgWebsite || organization.orgWebsite;
      organization.orgType = orgType || organization.orgType;
      organization.orgStatus = orgStatus !== undefined ? orgStatus : organization.orgStatus;
      organization.orgAddress = orgAddress || organization.orgAddress;

      const updatedOrganization = await organization.save();

      res.status(200).json({
        success: true,
        organization: {
          _id: updatedOrganization._id,
          orgName: updatedOrganization.orgName,
          orgEmail: updatedOrganization.orgEmail,
          orgPhone: updatedOrganization.orgPhone,
          orgLogo: updatedOrganization.orgLogo,
          orgDescription: updatedOrganization.orgDescription,
          orgWebsite: updatedOrganization.orgWebsite,
          orgType: updatedOrganization.orgType,
          orgStatus: updatedOrganization.orgStatus,
          orgAddress: updatedOrganization.orgAddress,
        },
      });
    } else {
      res.status(404).json({ message: "Organization not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Voter Management
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
      organization: req.organization._id,
      voterName,
      voterEmail,
      voterPassword: hashedPassword,
      voterAddress,
      voterPhone,
      voterGender,
      voterAge,
      voterStatus: false,
      voterVoted: false,
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
    const voters = await Voter.find({ organization: req.organization._id })
      .populate("organization", "orgName orgEmail")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      voters: voters || [],
    });
  } catch (error) {
    console.error("Error fetching voters:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVoterById = async (req, res) => {
  try {
    const voter = await Voter.findOne({
      _id: req.params.id,
      organization: req.organization._id,
    }).populate("organization", "orgName orgEmail");

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    res.status(200).json({
      success: true,
      voter,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVoter = async (req, res) => {
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

    const voter = await Voter.findOne({
      _id: req.params.id,
      organization: req.organization._id,
    });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    voter.voterName = voterName || voter.voterName;
    voter.voterEmail = voterEmail || voter.voterEmail;
    voter.voterAddress = voterAddress || voter.voterAddress;
    voter.voterPhone = voterPhone || voter.voterPhone;
    voter.voterGender = voterGender || voter.voterGender;
    voter.voterAge = voterAge || voter.voterAge;

    if (voterPassword) {
      voter.voterPassword = await bcrypt.hash(voterPassword, 10);
    }

    const updatedVoter = await voter.save();

    res.status(200).json({
      success: true,
      voter: {
        _id: updatedVoter._id,
        voterName: updatedVoter.voterName,
        voterEmail: updatedVoter.voterEmail,
        voterAddress: updatedVoter.voterAddress,
        voterPhone: updatedVoter.voterPhone,
        voterGender: updatedVoter.voterGender,
        voterAge: updatedVoter.voterAge,
        voterStatus: updatedVoter.voterStatus,
        voterVoted: updatedVoter.voterVoted,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVoterStatus = async (req, res) => {
  try {
    const { voterStatus } = req.body;
    const voter = await Voter.findOne({
      _id: req.params.id,
      organization: req.organization._id,
    });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
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
    const voter = await Voter.findOne({
      _id: req.params.id,
      organization: req.organization._id,
    });

    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
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
