import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import orgRoutes from "./src/routes/organizationRoutes.js";
import candidateRoutes from "./src/routes/candidateRoutes.js";
import voterRoutes from "./src/routes/VoterRoutes.js";
import electionRoutes from "./src/routes/electionRoutes.js";




dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/admin", adminRoutes);
app.use("/api/election", electionRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/voter", voterRoutes); // Fixed this line

app.get("/", (req, res) => {
  res.send("server connected");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on port", port);
  connectDB();
 
});
