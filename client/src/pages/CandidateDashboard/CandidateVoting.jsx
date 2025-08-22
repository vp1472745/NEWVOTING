import React, { useState } from "react";
import axios from "../../config/axois";

const CandidateVoting = ({ electionId, candidateId }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState([
    "Option 1",
    "Option 2",
    "Option 3",
    // You can fetch real options from backend if needed
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setMessage("Please select an option to vote.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await axios.post("/vote", {
        electionId,
        candidateId,
        vote: selectedOption,
      });
      setMessage("Vote submitted successfully!");
    } catch (err) {
      setMessage("Failed to submit vote.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Cast Your Vote</h2>
      <form onSubmit={handleVote} className="space-y-4">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="radio"
              id={option}
              name="voteOption"
              value={option}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
              className="mr-2"
            />
            <label htmlFor={option} className="text-gray-700">{option}</label>
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Vote"}
        </button>
        {message && <div className="mt-4 text-center text-sm text-blue-600">{message}</div>}
      </form>
    </div>
  );
};

export default CandidateVoting;