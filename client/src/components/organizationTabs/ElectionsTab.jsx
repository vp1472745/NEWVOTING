import React, { useState, useEffect } from "react";
import axios from "../../config/axois";
import { FaEye, FaEdit, FaTrash, FaVoteYea, FaSearch, FaClipboard, FaUserPlus } from "react-icons/fa";
import AddElectionForm from "../modals/Organization/AddElectionForm";
import ViewElectionModal from "../modals/Organization/ViewElectionModal";
import EditElectionModal from "../modals/Organization/EditElectionModal";
import { Link } from "react-router-dom";

const statusClasses = {
  "Not Started": "bg-yellow-100 text-yellow-700",
  "Started": "bg-blue-100 text-blue-700",
  "Polling": "bg-purple-100 text-purple-700",
  "Completed": "bg-gray-100 text-gray-700",
  "Results Declared": "bg-green-100 text-green-700",
};

const ElectionsTab = () => {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    filterElections();
  }, [searchQuery, elections]);

  const fetchElections = async () => {
    try {
      const res = await axios.get("/election/all");
      setElections(res.data.elections);
    } catch (err) {
      console.error("Fetch elections error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterElections = () => {
    const lowerSearch = searchQuery.toLowerCase();
    const filtered = elections.filter((election) =>
      `${election.electionName} ${new Date(election.electionDate).toLocaleDateString()} ${election.electionStartTime} ${election.electionEndTime} ${election.electionStatus} ${election.electionPosition.length}`
        .toLowerCase()
        .includes(lowerSearch)
    );
    setFilteredElections(filtered);
  };

  const handleView = (election) => {
    setSelectedElection(election);
    setIsViewModalOpen(true);
  };

  const handleEdit = (election) => {
    setSelectedElection(election);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        const response = await axios.delete(`/election/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          fetchElections();
        } else {
          alert(response.data.message || "Failed to delete election");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert(err.response?.data?.message || "Failed to delete election");
      }
    }
  };

  const handleCopyPublicLink = (election) => {
    const publicLink = `${window.location.origin}/election/${election._id}`;
    navigator.clipboard.writeText(publicLink);
    alert("Public election link copied!");
  };

  const handleCopyCandidateLinkWithTemplate = (election) => {
    const candidateLink = `${window.location.origin}/apply/${election._id}`;
    const template = `
Election Name: ${election.electionName}
Date: ${new Date(election.electionDate).toLocaleDateString()}
Time: ${election.electionStartTime} – ${election.electionEndTime}
Status: ${election.electionStatus}
Positions: ${election.electionPosition.map(pos => pos.positionName).join(", ")}

Apply as a candidate using the link below:
${candidateLink}
    `.trim();
    navigator.clipboard.writeText(template);
    alert("Candidate link with details copied!");
  };

  const handleCopyVoterLinkWithTemplate = (election) => {
    const voterLink = `${window.location.origin}/voter/register?election=${election._id}`;
    const template = `
Election Name: ${election.electionName}
Date: ${new Date(election.electionDate).toLocaleDateString()}
Time: ${election.electionStartTime} – ${election.electionEndTime}
Status: ${election.electionStatus}
Positions: ${election.electionPosition.map(pos => pos.positionName).join(", ")}

Register as a voter using the link below:
${voterLink}
    `.trim();
    navigator.clipboard.writeText(template);
    alert("Voter registration link with details copied!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Election Management</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search elections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 justify-center shadow-md hover:shadow-lg"
            >
              <FaVoteYea /> Create Election
            </button>
          </div>
        </div>

        {filteredElections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {searchQuery ? "No matching elections found" : "No elections available"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try a different search term" : "Create a new election to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
              >
                <FaVoteYea /> Create Election
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map((election) => (
              <div
                key={election._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {election.electionName}
                    </h3>
                    <div className="flex gap-3 text-lg">
                      <button
                        onClick={() => handleView(election)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(election)}
                        className="text-green-500 hover:text-green-700 transition"
                        title="Edit Election"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(election._id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete Election"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24">Date:</span>
                      <span>{new Date(election.electionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24">Time:</span>
                      <span>{election.electionStartTime} – {election.electionEndTime}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24">Status:</span>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${statusClasses[election.electionStatus] || "bg-gray-100 text-gray-700"}`}
                      >
                        {election.electionStatus}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24">Positions:</span>
                      <span>{election.electionPosition.length}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex gap-4 items-center">
                  <button
                    onClick={() => handleView(election)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <FaEye className="text-sm" /> View Details
                  </button>
                  <button
                    onClick={() => handleCopyPublicLink(election)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                    title="Copy Public Election Link"
                  >
                    <FaClipboard className="text-sm" /> Candidate Apply Link
                  </button>
                  <button
                    onClick={() => handleCopyVoterLinkWithTemplate(election)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
                    title="Copy Voter Registration Link"
                  >
                    <FaUserPlus className="text-sm" /> Voter Register Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddElectionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          fetchElections();
        }}
      />

      <ViewElectionModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        election={selectedElection}
      />

      <EditElectionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        election={selectedElection}
        onUpdate={fetchElections}
      />
    </>
  );
};

export default ElectionsTab;
