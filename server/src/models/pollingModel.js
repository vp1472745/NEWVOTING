import mongoose from "mongoose";


const pollingSchema = new mongoose.Schema({
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true, 
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true, 
  },
  pollingDate: {
    type: Date,
    required: true,
  },
  pollingStartTime: {
    type: String,
    required: true,
  },
  pollingEndTime: {
    type: String,
    required: true,
  },
  pollingStatus: {
    type: String,
    enum: ['Not-Started','Active', 'Completed'],
    default: 'active',
  },
  nominatedCandidate:[
    {
      Candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true, 
      },
      candidateName:
      {
        type: String,
        required: true, 
      },
      candidatePosition:
      {
        type: String,
        required: true,
      },
      CandidateVote:
      {
        type: Number,
        default: 0,
      },
    }
  ]
},{timestamps: true});

const Polling = mongoose.model("Polling", pollingSchema);

export default Polling;