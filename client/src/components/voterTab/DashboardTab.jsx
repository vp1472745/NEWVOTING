import React, { useEffect, useState } from "react";
import axios from "../../config/axois";
import { useNavigate } from "react-router-dom";
import EditVoterModals from "../modals/Voter/EditVoterModals"; // <-- Import the modal

const DashboardTab = () => {
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missingId, setMissingId] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // <-- Modal state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoterProfile = async () => {
      try {
        const voterId = localStorage.getItem("voterId");

        if (!voterId || voterId === "undefined" || voterId.trim() === "") {
          console.warn("Invalid or missing voter ID in localStorage");
          setMissingId(true);
          setLoading(false);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return;
        }

        const res = await axios.get(`/voter/${voterId}`);
        if (res.data.success) {
          setVoter(res.data.voter);
        }
      } catch (error) {
        console.error("Error fetching voter profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoterProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (missingId) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md text-center">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Voter ID Not Found</h2>
        <p className="text-gray-600 mb-6">Please log in again to access your profile.</p>
        <div className="text-sm text-gray-500">
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  // Handler to update voter info after editing
  const handleVoterUpdate = (updatedVoter) => {
    setVoter(updatedVoter);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h2 className="text-2xl font-bold">Voter Dashboard</h2>
        <p className="text-blue-100">Welcome to your voting profile</p>
      </div>

      {voter && (
        <div className="p-6">
          {/* Profile Card */}
          <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-medium text-blue-800">
                    {voter.voterName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-semibold text-gray-800">{voter.voterName}</h3>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${voter.voterStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {voter.voterStatus ? "Active" : "Inactive"}
                    </span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${voter.voterVoted ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {voter.voterVoted ? "Voted" : "Not Voted"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-gray-800 truncate">{voter.voterEmail}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium text-gray-800">{voter.voterPhone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</p>
                <p className="text-sm font-medium text-gray-800">{voter.voterAddress}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{voter.voterGender}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</p>
                <p className="text-sm font-medium text-gray-800">{voter.voterAge}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Voter ID</p>
                <p className="text-sm font-medium text-gray-800 truncate">{voter._id}</p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Voting Information</h3>
              <p className="text-sm text-gray-700 mb-4">Check your voting status and election details.</p>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                View Election Details →
              </button>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Account Settings</h3>
              <p className="text-sm text-gray-700 mb-4">Update your profile information or change password.</p>
              <button
                className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                onClick={() => setEditOpen(true)} // <-- Open modal on click
              >
                Manage Account →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Voter Modal */}
      <EditVoterModals
        voter={voter}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={handleVoterUpdate}
      />
    </div>
  );
};

export default DashboardTab;