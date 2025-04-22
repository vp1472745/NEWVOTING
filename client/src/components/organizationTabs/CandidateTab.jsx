import React, { useState, useEffect } from "react";
import axios from "../../config/axois";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import AddCandidateForm from "../modals/Organization/AddCandidateForm";
import EditCandidateModal from "../modals/Organization/EditCandidateModal";
import ViewCandidateModal from "../modals/Organization/ViewCandidateModal";
import { RiUserSearchLine } from "react-icons/ri"; // Add this import

const CandidatesTab = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [elections, setElections] = useState([]); // Add elections state
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const [selectedElectionFilter, setSelectedElectionFilter] = useState(""); // Add election filter state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch candidates and elections in parallel
        const [candidatesRes, electionsRes] = await Promise.all([
          axios.get("/candidate/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("/election/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        if (candidatesRes.data.success) {
          setCandidates(candidatesRes.data.candidates);
        } else {
          setError(candidatesRes.data.message || "Failed to fetch candidates");
        }

        if (electionsRes.data.success) {
          setElections(electionsRes.data.elections);
        } else {
          setError("Failed to fetch elections. Please try again.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get("/election/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Log the full response

      if (res.data.success) {
        setElections(res.data.elections);
        // Log the elections data
      } else {
        console.error("API returned success: false", res.data.message);
        setError("Failed to fetch elections. Please try again.");
      }
    } catch (err) {
      console.error("Fetch elections error:", err);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("/candidate/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCandidates(res.data.candidates);
        // Ensure election data is included in the fetched candidates
        if (res.data.candidates.length > 0) {
          fetchElections(); // Fetch elections after candidates are loaded
        }
      } else {
        setError(res.data.message || "Failed to fetch candidates");
      }
    } catch (err) {
      console.error("Fetch candidates error:", err);
      setError(err.response?.data?.message || "Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        const response = await axios.delete(`/candidate/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          fetchCandidates();
        } else {
          setError(response.data.message || "Failed to delete candidate");
        }
      } catch (err) {
        console.error("Delete error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to delete candidate. Please try again."
        );
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `/candidate/update/${id}`,
        {
          candidateStatus: !currentStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setCandidates((prevCandidates) =>
          prevCandidates.map((candidate) =>
            candidate._id === id
              ? { ...candidate, candidateStatus: !currentStatus }
              : candidate
          )
        );
      } else {
        setError(res.data.message || "Failed to update candidate status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError(
        err.response?.data?.message || "Failed to update candidate status"
      );
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to ${
          newStatus ? "approve" : "reject"
        } all candidates?`
      )
    ) {
      try {
        const res = await axios.put("/candidate/bulk-status", {
          candidateStatus: newStatus,
        });

        if (res.data.success) {
          // Update local state
          setCandidates((prevCandidates) =>
            prevCandidates.map((candidate) => ({
              ...candidate,
              candidateStatus: newStatus,
            }))
          );
        } else {
          setError(res.data.message || "Failed to update statuses");
        }
      } catch (err) {
        console.error("Bulk status update error:", err);
        setError(err.response?.data?.message || "Failed to update statuses");
      }
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading candidates...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;

  const filteredCandidates = candidates.filter((candidate) => {
    const election = elections.find((e) => e._id === candidate.election._id);

    const matchesSearch =
      candidate.candidateName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.candidateEmail
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.appliedPost?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (election &&
        election.electionName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesElectionFilter = selectedElectionFilter
      ? candidate.election._id === selectedElectionFilter
      : true;

    return matchesSearch && matchesElectionFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Candidates Management
          </h2>
          <p className="text-gray-600 mt-1">
            Total Candidates: {candidates.length}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleBulkStatusChange(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approve All
          </button>
          <button
            onClick={() => handleBulkStatusChange(false)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reject All
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaUserPlus className="mr-2" />
            Add Candidate
          </button>
        </div>
      </div>

      {/* Add Search Bar and Election Filter */}
      <div className="flex gap-4">
        
        <select
          value={selectedElectionFilter}
          onChange={(e) => setSelectedElectionFilter(e.target.value)}
          className="w-full max-w-md px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Elections</option>
          {elections.map((election) => (
            <option key={election._id} value={election._id}>
              {election.electionName}
            </option>
          ))}
        </select>
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <RiUserSearchLine className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Election Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => {
                const election = elections.find(
                  (e) => e._id === candidate.election._id
                );
                return (
                  <tr key={candidate._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {election ? election.electionName : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {candidate.candidateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.candidateEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.appliedPost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            candidate._id,
                            candidate.candidateStatus
                          )
                        }
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          candidate.candidateStatus
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        <div className="flex items-center">
                          {candidate.candidateStatus ? (
                            <>
                              <FaCheck className="mr-1" /> Approved
                            </>
                          ) : (
                            <>
                              <FaTimes className="mr-1" /> Rejected
                            </>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleView(candidate)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(candidate._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddCandidateForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchCandidates}
      />

      <EditCandidateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        candidate={selectedCandidate}
        onUpdate={fetchCandidates}
      />

      {/* Uncomment these once modals are available */}
      <ViewCandidateModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default CandidatesTab;
