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
      electionStatus = 'Not Started' // Default value
    } = req.body;

    // Validate status if provided
    if (electionStatus && !['Not Started', 'Started', 'Polling', 'Completed', 'Results Declared'].includes(electionStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid election status'
      });
    }

    const organizationId = req.organization?._id || req.body.organizationId;

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
      electionStatus, // Now properly validated
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

export const updateElection = async (req, res) => {
  try {
    const { electionName, electionDate, electionStartTime, electionEndTime, electionStatus, electionPosition, Organization } = req.body;
    
    // Find and update the election
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      {
        electionName,
        electionDate: new Date(electionDate),
        electionStartTime,
        electionEndTime,
        electionStatus,
        electionPosition,
        Organization
      },
      { new: true, runValidators: true }
    );

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    res.status(200).json({
      success: true,
      data: election
    });
    
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating election'
    });
  }
};

export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Election deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting election'
    });
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

export const getActiveElections = async (req, res) => {
  try {
    const activeElections = await Election.find({
      electionStatus: { $in: ['Started', 'Polling'] }
    }).populate('Organization', 'orgName');

    res.status(200).json({
      success: true,
      elections: activeElections
    });
  } catch (error) {
    console.error('Error fetching active elections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active elections'
    });
  }
};


