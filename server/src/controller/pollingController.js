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
            election: electionId
        });

        if (existingPolling) {
            return res.status(400).json({ message: "Polling already exists for this election" });
        }

        // Get approved candidates for this election
        const candidates = await Candidate.find({
            organization: organizationId,
            election: electionId,
            candidateStatus: "approved"
        });

        if (candidates.length === 0) {
            return res.status(400).json({ message: "No approved candidates found for this election" });
        }

        // Format candidates for polling
        const nominatedCandidates = candidates.map(candidate => ({
            Candidate: candidate._id,
            candidateName: candidate.candidateName,
            candidatePosition: candidate.appliedPost,
            CandidateVote: 0
        }));

        // Create polling document
        const newPolling = new Polling({
            organization: organizationId,
            election: electionId,
            pollingDate: election.electionDate,
            pollingStartTime: election.electionStartTime,
            pollingEndTime: election.electionEndTime,
            pollingStatus: 'Not-Started',
            nominatedCandidate: nominatedCandidates
        });

        await newPolling.save();

        res.status(201).json({
            success: true,
            message: "Polling created successfully",
            polling: newPolling,
        });
    } catch (error) {
        console.error("Error in createPolling:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getCurrentPolling = async (req, res) => {
    try {
//         const polling = await Polling.find({});
//         res.status(200).json(polling);

console.log("getCurrentPolling");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}