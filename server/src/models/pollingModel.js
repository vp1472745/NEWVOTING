// pollingModel.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate", // Candidate model ka reference
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollingSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    candidates: [candidateSchema], // Multiple candidates ke liye array
  },
  { timestamps: true }
);

const Polling = mongoose.model("Polling", pollingSchema);

export default Polling;
