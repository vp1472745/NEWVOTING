import mongoose from "mongoose";
const candidateSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
  },
  candidateEmail: {
    type: String,
    required: true,
    unique: true,
  },
  candidatePassword: {
    type: String,
    required: true,
  },
  candidateAddress: {
    type: String,
    required: true,
  },
  candidatePhone: {
    type: String,
    required: true,
  },
  candidateImage: {
    type: String,
    required: true,
  },
  candidatePayImage: {
    type: String,
    required: true,
  },
  candidateGender: {
    type: String,
    required: true,
  },
  candidateAge: {
    type: Number,
    required: true,
  },
  candidateStatus: {
    type: Boolean,
 default:false,
  },
  appliedPost: {
    type: String,
    required: true, 
  }
},{timestamps:true});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
