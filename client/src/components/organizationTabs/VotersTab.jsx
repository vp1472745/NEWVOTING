import React, { useState, useEffect } from "react";
import axios from "../../config/axois";
import {
  FaEye,
  FaTrash,
  FaUserPlus,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { RiUserSearchLine } from "react-icons/ri";
import AddVoterModal from "../modals/Organization/AddVoterModal";
import ViewVoterModal from "../modals/Organization/ViewVoterModal";
import EditVoterModal from "../modals/Organization/EditVoterModal";

const VotersTab = () => {
  const [voters, setVoters] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [voterRes, electionRes] = await Promise.all([
        axios.get("/org/voter/all"),
        axios.get("/election/all"),
      ]);

      if (voterRes.data.success && electionRes.data.success) {
        setVoters(voterRes.data.voters);
        setElections(electionRes.data.elections);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (voter) => {
    setSelectedVoter(voter);
    setIsViewModalOpen(true);
  };

  const handleEdit = (voter) => {
    setSelectedVoter(voter);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this voter?")) {
      try {
        const res = await axios.delete(`/org/voter/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          fetchAllData();
        } else {
          setError(res.data.message || "Failed to delete voter");
        }
      } catch (err) {
        setError("Error deleting voter.");
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `/org/voter/status/${id}`,
        { voterStatus: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setVoters((prev) =>
          prev.map((voter) =>
            voter._id === id
              ? { ...voter, voterStatus: !currentStatus }
              : voter
          )
        );
      }
    } catch (err) {
      setError("Failed to update voter status.");
    }
  };

  const getElectionName = (id) => {
    const election = elections.find((e) => e._id === id);
    return election ? election.electionName : "N/A";
  };

  const filteredVoters = voters.filter((voter) => {
    const search = searchTerm.toLowerCase();
    return (
      voter.voterName?.toLowerCase().includes(search) ||
      voter.voterEmail?.toLowerCase().includes(search) ||
      voter.voterPhone?.toLowerCase().includes(search)
    );
  });

  if (loading) return <div className="text-center py-8">Loading voters...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Voters Management</h2>
          <p className="text-gray-600 mt-1">Total Voters: {voters.length}</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaUserPlus className="mr-2" />
          Add Voter
        </button>
      </div>

      <div className="flex gap-4">
        <div className="w-full max-w-md">
          <div className="flex items-center border rounded-lg px-3">
            <RiUserSearchLine className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search voters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Election</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVoters.map((voter) => (
                <tr key={voter._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voter.voterName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.voterEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.voterPhone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getElectionName(voter.electionId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(voter._id, voter.voterStatus)}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        voter.voterStatus
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      <div className="flex items-center">
                        {voter.voterStatus ? (
                          <>
                            <FaCheck className="mr-1" /> Active
                          </>
                        ) : (
                          <>
                            <FaTimes className="mr-1" /> Inactive
                          </>
                        )}
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleView(voter)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(voter)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(voter._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddVoterModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchAllData}
      />
      <ViewVoterModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        voter={selectedVoter}
      />
      <EditVoterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        voter={selectedVoter}
        onSuccess={fetchAllData}
      />
    </div>
  );
};

export default VotersTab;
