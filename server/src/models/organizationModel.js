import mongoose from "mongoose";
const organizationSchema = new mongoose.Schema(
  {
    orgName: {
      type: String,
      required: true,
    },
    orgEmail: {
      type: String,
      required: true,
      unique: true,
    },
    orgPassword: {
      type: String,
      required: true,
    },
    orgAddress: {
      type: String,
      required: true,
    },
    orgPhone: {
      type: String,
      required: true,
    },
    orgLogo: {
      type: String,
      required: true,
    },
    orgDescription: {
      type: String,
      required: true,
    },
    orgWebsite: {
      type: String,
      required: true,
    },
    orgType: {
      type: String,
      required: true,
    },
    orgStatus: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
