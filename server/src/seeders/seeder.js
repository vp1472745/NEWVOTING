import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/adminModel.js";
import Organization from "../models/organizationModel.js";
import Election from "../models/electionModel.js";
import Candidate from "../models/CandidateModel.js";
import Voter from "../models/votersModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const adminData = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
  },
];

const organizationData = [
  {
    orgName: "Election Commission",
    orgEmail: "ec@example.com",
    orgPassword: "ec123",
    orgAddress: "123 Main St, City",
    orgPhone: "1234567890",
    orgLogo: "https://placehold.co/400x400?text=EC",
    orgDescription: "Official Election Commission",
    orgWebsite: "https://ec.example.com",
    orgType: "Government",
    orgStatus: true,
  },
  {
    orgName: "Local Elections Board",
    orgEmail: "leb@example.com",
    orgPassword: "leb123",
    orgAddress: "456 Oak St, Town",
    orgPhone: "0987654321",
    orgLogo: "https://placehold.co/400x400?text=LEB",
    orgDescription: "Local Elections Board",
    orgWebsite: "https://leb.example.com",
    orgType: "Local Government",
    orgStatus: true,
  },
];

const electionData = [
  {
    electionName: "General Election 2024",
    electionDate: new Date("2024-05-15"),
    electionStartTime: "08:00",
    electionEndTime: "18:00",
    electionStatus: true,
    electionPosition: [
      {
        positionName: "President",
        positionDescription: "Head of State",
      },
      {
        positionName: "Vice President",
        positionDescription: "Deputy Head of State",
      },
    ],
  },
];

const candidateData = [
  {
    candidateName: "John Doe",
    candidateEmail: "john@example.com",
    candidatePassword: "candidate123",
    candidateAddress: "789 Pine St, City",
    candidatePhone: "5551234567",
    candidateImage: "https://placehold.co/400x400?text=JD",
    candidatePayImage: "https://placehold.co/400x400?text=John+Doe+Payment",
    candidateGender: "Male",
    candidateAge: 35,
    candidateStatus: true,
    appliedPost: "President",
  },
  {
    candidateName: "Jane Smith",
    candidateEmail: "jane@example.com",
    candidatePassword: "candidate123",
    candidateAddress: "321 Elm St, Town",
    candidatePhone: "5559876543",
    candidateImage: "https://placehold.co/400x400?text=JS",
    candidatePayImage: "https://placehold.co/400x400?text=Jane+Smith+Payment",
    candidateGender: "Female",
    candidateAge: 32,
    candidateStatus: true,
    appliedPost: "Vice President",
  },
];

const voterData = [
  {
    voterName: "Alice Johnson",
    voterEmail: "alice@example.com",
    voterPassword: "voter123",
    voterAddress: "123 Voter St, City",
    voterPhone: "5551112222",
    voterGender: "Female",
    voterAge: 25,
    voterStatus: true,
    voterVoted: false
  },
  {
    voterName: "Bob Wilson",
    voterEmail: "bob@example.com",
    voterPassword: "voter123",
    voterAddress: "456 Voter Ave, Town",
    voterPhone: "5553334444",
    voterGender: "Male",
    voterAge: 30,
    voterStatus: true,
    voterVoted: false
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany();
    await Organization.deleteMany();
    await Election.deleteMany();
    await Candidate.deleteMany();
    await Voter.deleteMany();

    console.log("Cleared existing data");

    // Hash passwords
    const hashedAdminData = await Promise.all(
      adminData.map(async (admin) => ({
        ...admin,
        password: await bcrypt.hash(admin.password, 10),
      }))
    );

    const hashedOrgData = await Promise.all(
      organizationData.map(async (org) => ({
        ...org,
        orgPassword: await bcrypt.hash(org.orgPassword, 10),
      }))
    );

    const hashedCandidateData = await Promise.all(
      candidateData.map(async (candidate) => ({
        ...candidate,
        candidatePassword: await bcrypt.hash(candidate.candidatePassword, 10),
      }))
    );

    const hashedVoterData = await Promise.all(
      voterData.map(async (voter) => ({
        ...voter,
        voterPassword: await bcrypt.hash(voter.voterPassword, 10),
      }))
    );

    // Create admin
    const admin = await Admin.create(hashedAdminData);
    console.log("Admin created");

    // Create organizations
    const organizations = await Organization.create(hashedOrgData);
    console.log("Organizations created");

    // Create elections with organization reference
    const elections = await Promise.all(
      electionData.map(async (election) => {
        const newElection = new Election({
          ...election,
          Organization: organizations[0]._id, // Link to first organization
        });
        return newElection.save();
      })
    );
    console.log("Elections created");

    // Create candidates with organization and election references
    const candidates = await Promise.all(
      hashedCandidateData.map(async (candidate, index) => {
        const newCandidate = new Candidate({
          ...candidate,
          organization: organizations[0]._id, // Link to first organization
          election: elections[0]._id, // Link to first election
        });
        return newCandidate.save();
      })
    );
    console.log("Candidates created");

    // Create voters with organization reference
    const voters = await Promise.all(
      hashedVoterData.map(async (voter) => {
        const newVoter = new Voter({
          ...voter,
          organization: organizations[0]._id, // Link to first organization
        });
        return newVoter.save();
      })
    );
    console.log("Voters created");

    console.log("Database seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData(); 