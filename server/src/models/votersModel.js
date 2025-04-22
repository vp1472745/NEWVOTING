import mongoose from "mongoose";
const voterSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    voterName: {
      type: String,
      required: true,
    },
    voterEmail: {
      type: String,
      required: true,
      unique: true,
    },
    voterPassword: {
      type: String,
      required: true,
    },
    voterAddress: {
      type: String,
      required: true,
    },
    voterPhone: {
      type: String,
      required: true,
    },
    voterGender: {
      type: String,
      required: true,
    },
    voterAge: {
      type: Number,
      required: true,
    },
    voterStatus: {
      type: Boolean,
      required: true,
    },
    voterVoted: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
const Voter = mongoose.model("Voter", voterSchema);

export default Voter;
