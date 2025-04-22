import React, { useEffect, useState } from "react";
import axios from "../../../config/axois";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("/candidate/all");
        if (res.data.success) {
          setCandidates(res.data.candidates);
        } else {
          console.error(res.data.message);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registered Candidates</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="bg-white rounded-xl shadow p-4">
            <img
              src={candidate.candidateImage}
              alt={candidate.candidateName}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h3 className="text-lg font-semibold">{candidate.candidateName}</h3>
            <p className="text-sm text-gray-600">Email: {candidate.candidateEmail}</p>
            <p className="text-sm text-gray-600">Phone: {candidate.candidatePhone}</p>
            <p className="text-sm text-gray-600">Post: {candidate.appliedPost}</p>
            <p className="text-sm text-gray-600">Election: {candidate.election?.name}</p>
            <p className={`text-sm font-medium ${candidate.candidateStatus ? "text-green-600" : "text-red-600"}`}>
              Status: {candidate.candidateStatus ? "Approved" : "Pending"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
