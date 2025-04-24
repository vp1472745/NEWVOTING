const mongoose = require('mongoose');

const pollingSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    candidates: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        votes: {
            type: Number,
            default: 0
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
pollingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Polling = mongoose.model('Polling', pollingSchema);

// Example usage:
// 1. Create a new polling record
const createPolling = async (organizationId, electionId, candidates) => {
    try {
        const polling = new Polling({
            organizationId,
            electionId,
            candidates
        });
        return await polling.save();
    } catch (error) {
        throw error;
    }
};

// 2. Get polling by ID
const getPollingById = async (id) => {
    try {
        return await Polling.findById(id);
    } catch (error) {
        throw error;
    }
};

// 3. Update votes for a candidate
const updateVotes = async (pollingId, candidateId, voteCount) => {
    try {
        return await Polling.findOneAndUpdate(
            { 
                _id: pollingId,
                'candidates.id': candidateId 
            },
            { 
                $set: { 'candidates.$.votes': voteCount }
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// 4. Get all pollings for an organization
const getPollingsByOrganization = async (organizationId) => {
    try {
        return await Polling.find({ organizationId });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    Polling,
    createPolling,
    getPollingById,
    updateVotes,
    getPollingsByOrganization
}; 