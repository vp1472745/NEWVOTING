import Polling from '../models/pollingModel.js';
import Organization from '../models/organizationModel.js';
import Election from '../models/electionModel.js';
import Voter from '../models/votersModel.js';
import Candidate from '../models/candidateModel.js';

export const createPolling = async (req, res) => {
  try {
    const { organizationId, electionId } = req.body;

    // Validation
    if (!electionId || !organizationId) {
      return res.status(400).json({ message: "Election ID and Organization ID are required" });
    }

    // Check if election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Check if polling already exists for this election
    const existingPolling = await Polling.findOne({
      organization: organizationId,
      election: electionId,
    });

    if (existingPolling) {
      return res.status(400).json({ message: "Polling already exists for this election" });
    }

    // Get approved candidates for this election
    const candidates = await Candidate.find({
      organization: organizationId,
      election: electionId,
      candidateStatus: "approved",
    });

    if (candidates.length === 0) {
      return res.status(400).json({ message: "No approved candidates found for this election" });
    }

    // Format candidates for polling
    const nominatedCandidates = candidates.map((candidate) => ({
      Candidate: candidate._id,
      candidateName: candidate.candidateName,
      candidatePosition: candidate.appliedPost,
      CandidateVote: 0,
    }));

    // Create polling document
    const newPolling = new Polling({
      organization: organizationId,
      election: electionId,
      pollingDate: election.electionDate,
      pollingStartTime: election.electionStartTime,
      pollingEndTime: election.electionEndTime,
      pollingStatus: 'Not-Started', // Default to Not-Started
      nominatedCandidate: nominatedCandidates,
    });

    // Save the polling document
    const savedPolling = await newPolling.save();

    // Check if status needs to be updated immediately
    const startTime = new Date(`${newPolling.pollingDate}T${newPolling.pollingStartTime}:00.000Z`);
    const endTime = new Date(`${newPolling.pollingDate}T${newPolling.pollingEndTime}:00.000Z`);
    const now = new Date();

    let updatedStatus = 'Not-Started';
    if (now >= startTime && now <= endTime) {
      updatedStatus = 'Started';
    } else if (now > endTime) {
      updatedStatus = 'Completed';
    }

    if (updatedStatus !== newPolling.pollingStatus) {
      newPolling.pollingStatus = updatedStatus;
      await newPolling.save();
    }

    res.status(201).json({
      success: true,
      message: "Polling created successfully",
      polling: savedPolling,
    });
  } catch (error) {
    console.error("Error in createPolling:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getCurrentPolling = async (req, res) => {
  try {
    const user = req.user; // decoded token se mila user object

    // Get today's date in UTC (start of day and end of day)
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0); // Start of today's day (00:00:00)
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999); // End of today's day (23:59:59)

    // Log the date range for debugging
    console.log("Start of Day:", startOfDay);
    console.log("End of Day:", endOfDay);

    const orgId = user.organization?._id?.toString() || user.organization?.toString();

    // Polling fetch based on organization and today's date in UTC
    const polling = await Polling.find({
      organization: orgId,
      pollingDate: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() },
    })
      .populate('election')
      .populate('nominatedCandidate');

    // Log polling data for debugging
    console.log("Polling Data:", polling);

    res.status(200).json({
      success: true,
      message: "Polling data retrieved successfully",
      polling,
    });
  } catch (error) {
    console.error("Error in getCurrentPolling:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve polling data",
    });
  }
};


  
