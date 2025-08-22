import React from "react";
import CandidateVoting from "./CandidateVoting.jsx";

const CandidateMainContent = ({ active, candidateData, ...props }) => {
  if (active === "profile") {
    if (!candidateData) {
      return (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">Loading profile...</span>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-8">
        <div className="flex items-center p-6 border-b">
          <img
            src={candidateData.candidateImage}
            alt="Candidate"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-blue-700">{candidateData.candidateName}</h2>
            <p className="text-gray-600">{candidateData.candidateEmail}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
              ${candidateData.candidateStatus === "approved" ? "bg-green-100 text-green-700" :
                candidateData.candidateStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"}`}>
              {candidateData.candidateStatus}
            </span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-gray-700">Phone:</span>
              <span className="ml-2 text-gray-600">{candidateData.candidatePhone}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Gender:</span>
              <span className="ml-2 text-gray-600">{candidateData.candidateGender}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Age:</span>
              <span className="ml-2 text-gray-600">{candidateData.candidateAge}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Address:</span>
              <span className="ml-2 text-gray-600">{candidateData.candidateAddress}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Applied Post:</span>
              <span className="ml-2 text-gray-600">{candidateData.appliedPost}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Agenda:</span>
              <span className="ml-2 text-gray-600">{candidateData.candidateAgenda}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Organization:</span>
              <span className="ml-2 text-gray-600">{String(candidateData.organization)}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Election:</span>
              <span className="ml-2 text-gray-600">{String(candidateData.election)}</span>
            </div>
          </div>
          <div className="mt-6">
            <span className="font-semibold text-gray-700">Payment Image:</span>
            <div className="mt-2">
              {candidateData.candidatePayImage ? (
                <img
                  src={candidateData.candidatePayImage}
                  alt="Payment"
                  className="w-32 h-32 object-cover rounded border"
                />
              ) : (
                <span className="text-gray-400">No payment image uploaded</span>
              )}
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <div>Created: {candidateData.createdAt && new Date(candidateData.createdAt).toLocaleString()}</div>
            <div>Updated: {candidateData.updatedAt && new Date(candidateData.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  }
  if (active === "edit") {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Edit Profile</h2>
        {props.renderEditForm && props.renderEditForm()}
      </div>
    );
  }
  if (active === "results") {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Results</h2>
        <p>Results will be displayed here.</p>
      </div>
    );
  }
  if (active === "voting") {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Voting</h2>
        <CandidateVoting
          electionId={candidateData?.election}
          candidateId={candidateData?._id}
        />
      </div>
    );
  }
  return null;
};

export default CandidateMainContent;