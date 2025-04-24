import React, { useState, useEffect } from "react";
import axios from "../../config/axois";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import EditElectionAdministrationModal from "../modals/Organization/EditElectionAdministrationModal.jsx";

const TabElectionAdministration = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [deletedElectionId, setDeletedElectionId] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get("/election/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setElections(res.data.elections);
      } else {
        setError(res.data.message || "Failed to fetch elections");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch elections");
    } finally {
      setLoading(false);
    }
  };

  const handleAddElection = () => {
    setSelectedElection(null);
    setIsFormOpen(true);
  };

  const handleEditElection = (election) => {
    setSelectedElection(election);
    setIsFormOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdatingId(id);
    try {
      const res = await axios.put(`/election/${id}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        fetchElections();
      } else {
        setError(res.data.message || "Failed to update status");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDeleteElection = async (id) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        const res = await axios.delete(`/election/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setDeletedElectionId(id); // Track deleted election for View Result button
          fetchElections();
        } else {
          setError(res.data.message || "Failed to delete election");
        }
      } catch (err) {
        console.error("Delete error:", err);
        setError(err.response?.data?.message || "Failed to delete election");
      }
    }
  };

  const handleViewResult = (id) => {
    // Implement your logic to view result, e.g., navigate to result page
    window.location.href = `/election/${id}/result`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  // Remove the getElectionStatus function
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Election Administration</h2>
        {/* Removed Add Election button */}
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
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
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
              {elections.map((election) => (
                <tr key={election._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {election.electionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {election.electionDate ? new Date(election.electionDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {election.electionStartTime || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {election.electionEndTime || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <select
                      value={election.electionStatus || "Not Started"}
                      onChange={e => handleStatusChange(election._id, e.target.value)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${election.electionStatus === "Started"
                          ? "bg-green-100 text-green-800"
                          : election.electionStatus === "Not Started"
                          ? "bg-yellow-100 text-yellow-800"
                          : election.electionStatus === "Polling Done"
                          ? "bg-blue-100 text-blue-800"
                          : election.electionStatus === "Result"
                          ? "bg-purple-100 text-purple-800"
                          : election.electionStatus === "Result Declared"
                          ? "bg-pink-100 text-pink-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                      style={{ minWidth: 120 }}
                      disabled={statusUpdatingId === election._id}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Started">Started</option>
                      <option value="Polling Done">Polling Done</option>
                      <option value="Result">Result</option>
                      <option value="Result Declared">Result Declared</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditElection(election)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteElection(election._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleViewResult(election._id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Result
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditElectionAdministrationModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        election={selectedElection}
        onUpdate={fetchElections}
      />
    </div>
  );
};

export default TabElectionAdministration;