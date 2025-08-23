import React, { useEffect, useState } from "react";
import axios from "../../config/axois";

const ViewTab = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        console.log("Token:", token);
        const res = await axios.get("/voter/candidates", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setCandidates(res.data.candidates);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.candidateName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.appliedPost.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || candidate.candidateStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
    e.target.className =
      "absolute inset-0 h-full w-full object-contain bg-gray-100";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Candidate Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredCandidates.length} candidates found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg ${viewMode === "grid" ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg ${viewMode === "list" ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search candidates..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            No candidates found
          </h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col"
            >
              <div className="p-4 flex flex-col items-center">
                <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden mb-4">
                  <img
                    src={
                      candidate.candidateImage ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt={candidate.candidateName}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {candidate.candidateName}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {candidate.appliedPost}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(candidate.candidateStatus)}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {candidate.createdAt
                    ? new Date(candidate.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <button
                  onClick={() => setSelectedCandidate(candidate)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Election
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          src={candidate.candidateImage || "https://via.placeholder.com/300x300?text=No+Image"}
                          alt={candidate.candidateName}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{candidate.candidateName}</div>
                        <div className="text-sm text-gray-500">{candidate.candidateEmail || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{candidate.appliedPost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{candidate.election?.electionName || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(candidate.candidateStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-25" onClick={() => setSelectedCandidate(null)}></div>
            </div>

            {/* Modal content */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedCandidate.candidateName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Candidate for {selectedCandidate.appliedPost}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setSelectedCandidate(null)}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={selectedCandidate.candidateImage || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={selectedCandidate.candidateName}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>

                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </h4>
                        <div className="mt-1">
                          {getStatusBadge(selectedCandidate.candidateStatus)}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Contact
                        </h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Email:</span> {selectedCandidate.candidateEmail || "N/A"}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Phone:</span> {selectedCandidate.candidatePhone || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Candidate Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Position Applied
                          </h5>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCandidate.appliedPost}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Election
                          </h5>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCandidate.election?.electionName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Address
                          </h5>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCandidate.candidateAddress || "N/A"}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Gender
                          </h5>
                          <p className="mt-1 text-sm text-gray-900 capitalize">
                            {selectedCandidate.candidateGender || "N/A"}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Age
                          </h5>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCandidate.candidateAge || "N/A"}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Applied Date
                          </h5>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCandidate.createdAt ? new Date(selectedCandidate.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Campaign Agenda
                        </h5>
                        <div className="mt-2 p-4 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-700">
                            {selectedCandidate.candidateAgenda || "No agenda provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setSelectedCandidate(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTab;