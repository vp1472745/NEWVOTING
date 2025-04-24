import React, { useState, useEffect } from "react";
import axios from "../../config/axois";
import { FaEye, FaTrash, FaUserPlus, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import AddVoterModal from "../modals/Organization/AddVoterModal";
import ViewVoterModal from "../modals/Organization/ViewVoterModal";
import EditVoterModal from "../modals/Organization/EditVoterModal";
import { RiUserSearchLine } from "react-icons/ri";

const VotersTab = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const res = await axios.get("/org/voter/all");
      if (res.data.success) {
        setVoters(res.data.voters);
      } else {
        setError(res.data.message || "Failed to fetch voters");
      }
    } catch (err) {
      console.error("Fetch voters error:", err);
      setError(err.response?.data?.message || "Failed to fetch voters");
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
        const response = await axios.delete(`/org/voter/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          fetchVoters();
        } else {
          setError(response.data.message || "Failed to delete voter");
        }
      } catch (err) {
        console.error("Delete error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to delete voter. Please try again."
        );
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `/org/voter/status/${id}`,
        {
          voterStatus: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setVoters((prevVoters) =>
          prevVoters.map((voter) =>
            voter._id === id
              ? { ...voter, voterStatus: !currentStatus }
              : voter
          )
        );
      } else {
        setError(res.data.message || "Failed to update voter status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError(
        err.response?.data?.message || "Failed to update voter status"
      );
    }
  };

  const filteredVoters = voters.filter((voter) => {
    const matchesSearch =
      voter.voterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.voterEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.voterPhone?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
    <div className="flex items-center border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 px-3">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
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
              {filteredVoters.map((voter) => (
                <tr key={voter._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {voter.voterName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {voter.voterEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {voter.voterPhone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        handleStatusChange(voter._id, voter.voterStatus)
                      }
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
        onSuccess={fetchVoters}
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
        onSuccess={fetchVoters}
      />
    </div>
  );
};

export default VotersTab; 