import React, { useEffect, useState } from "react";
import axios from "../../config/axois";

const PollingTab = () => {
  const [pollingData, setPollingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPolling = async () => {
    try {
      const token = localStorage.getItem("token"); // Token voter login ke baad store hota hai
      if (!token) {
        setError("Token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get("/polling/", config);

      // Ensure that the polling data is an array before setting it
      if (Array.isArray(data)) {
        setPollingData(data);
      } else {
        setError("Polling data is not an array.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch polling data.");
      console.error("Polling fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolling();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading polling data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Current Polling</h1>

      {pollingData.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">No active polling found.</p>
        </div>
      ) : (
        pollingData.map((poll) => (
          <div key={poll._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Election Polling</h2>
                  <p className="text-gray-500">
                    Status:{" "}
                    <span className={`font-medium ${
                      poll.pollingStatus === "Active"
                        ? "text-green-600"
                        : poll.pollingStatus === "Completed"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}>
                      {poll.pollingStatus}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(poll.pollingDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time:</span> {poll.pollingStartTime} - {poll.pollingEndTime}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Candidates</h3>

                {poll.nominatedCandidate.length === 0 ? (
                  <p className="text-gray-500 italic">No candidates nominated for this polling.</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {poll.nominatedCandidate.map((cand) => (
                      <div key={cand._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{cand.candidateName}</h4>
                            <p className="text-gray-600 text-sm">{cand.candidatePosition}</p>
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {cand.CandidateVote || 0} votes
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Candidate ID: {cand.Candidate}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PollingTab;
