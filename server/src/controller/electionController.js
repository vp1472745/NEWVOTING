import Election from "../models/electionModel.js";
import Organization from "../models/organizationModel.js";

export const createElection = async (req, res, next) => {
  try {
    const {
      electionName,
      electionDate,
      electionStartTime,
      electionEndTime,
      electionPosition,
    } = req.body;

    const organizationId = req.organization?._id || req.body.organizationId; // depend karta hai flow pe

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "Organization ID is required" });
    }


    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    
    const newElection = new Election({
      Organization: organizationId,
      electionName,
      electionDate,
      electionStartTime,
      electionEndTime,
      electionStatus: false, // default status inactive
      electionPosition,
    });

    await newElection.save();

    res.status(201).json({
      success: true,
      message: "Election created successfully",
      election: newElection,
    });
  } catch (error) {
    console.error("Error creating election:", error);
    next(error);
  }
};

export const updateElection = async (req, res, next) => {
  try {
    const {
      electionName,
      electionDate,
      electionStartTime,
      electionEndTime,
      electionPosition,
    } = req.body;

    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found"
      });
    }

    // Check if organization owns this election
    if (election.Organization.toString() !== req.organization._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this election"
      });
    }

    // Don't allow updates if election is active
    if (election.electionStatus) {
      return res.status(400).json({
        success: false,
        message: "Cannot update active election"
      });
    }

    // Update fields if provided
    if (electionName) election.electionName = electionName;
    if (electionDate) election.electionDate = electionDate;
    if (electionStartTime) election.electionStartTime = electionStartTime;
    if (electionEndTime) election.electionEndTime = electionEndTime;
    if (electionPosition) election.electionPosition = electionPosition;

    const updatedElection = await election.save();

    res.status(200).json({
      success: true,
      message: "Election updated successfully",
      election: updatedElection
    });

  } catch (error) {
    console.error("Error updating election:", error);
    next(error);
  }
};

export const deleteElection = async (req, res, next) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found"
      });
    }

    // Check if organization owns this election
    if (election.Organization.toString() !== req.organization._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this election"
      });
    }

    // Don't allow deletion if election is active
    if (election.electionStatus) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete active election"
      });
    }

    await Election.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Election deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting election:", error);
    next(error);
  }
};

export const getAllElections = async (req, res, next) => {
  try {
    const elections = await Election.find({ Organization: req.organization._id })
      .populate('Organization', 'orgName orgEmail')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: elections.length,
      elections
    });
  } catch (error) {
    console.error("Error fetching elections:", error);
    next(error);
  }
};

export const getElectionById = async (req, res, next) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('Organization', 'orgName orgEmail');

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found"
      });
    }

    // Verify organization ownership
    if (election.Organization._id.toString() !== req.organization._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this election"
      });
    }

    res.status(200).json({
      success: true,
      election
    });
  } catch (error) {
    console.error("Error fetching election:", error);
    next(error);
  }
};



