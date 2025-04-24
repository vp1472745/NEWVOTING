import mongoose from "mongoose";


const electionSchema = new mongoose.Schema({
  Organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  electionName: {
    type: String,
    required: true,
  },
  electionDate: {
    type: Date,
    required: true,
  },
  electionStartTime: {
    type: String,
    required: true,
  },
  electionEndTime: {
    type: String,
    required: true,
  },
  electionStatus: {
    type: Boolean,
    required: true, 
  },
  electionPosition: {
    type: [
      {
        positionName: {
          type: String,
          required: true,
        },  
        positionDescription: {
          type: String,
          required: true,
        },
      }
    ],
    required: true, 
  }
},{timestamps: true});

const Election = mongoose.model("Election", electionSchema);

export default Election;