import React, { useState, useEffect } from "react";
import axios from "../../../config/axois";

const EditElectionModal = ({ isOpen, onClose, election, onUpdate }) => {
  const [formData, setFormData] = useState({
    electionName: "",
    electionDate: "",
    electionStartTime: "",
    electionEndTime: "",
    electionStatus: "Not Started", // Default to string
    electionPosition: [],
  });

  useEffect(() => {
    if (election) {
      setFormData({
        ...election,
        electionDate: new Date(election.electionDate)
          .toISOString()
          .split("T")[0],
        electionStatus: election.electionStatus || "Not Started", // Ensure string
      });
    }
  }, [election]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/election/update/${election._id}`, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Update election error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePositionChange = (index, field, value) => {
    const newPositions = [...formData.electionPosition];
    newPositions[index][field] = value;
    setFormData({ ...formData, electionPosition: newPositions });
  };

  const addPosition = () => {
    setFormData({
      ...formData,
      electionPosition: [
        ...formData.electionPosition,
        { positionName: "", positionDescription: "" },
      ],
    });
  };

  const removePosition = (index) => {
    const newPositions = formData.electionPosition.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, electionPosition: newPositions });
  };

  if (!isOpen || !election) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Election</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Election Name</label>
            <input
              name="electionName"
              value={formData.electionName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Election Date</label>
            <input
              type="date"
              name="electionDate"
              value={formData.electionDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Start Time</label>
              <input
                type="time"
                name="electionStartTime"
                value={formData.electionStartTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">End Time</label>
              <input
                type="time"
                name="electionEndTime"
                value={formData.electionEndTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="mb-4">
            <label className="block mb-2">Status</label>
            <select
              name="electionStatus"
              value={formData.electionStatus}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="Not Started">Not Started</option>
              <option value="Started">Started</option>
              <option value="Polling Done">Polling Done</option>
              <option value="Result">Result</option>
              <option value="Result Declared">Result Declared</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditElectionModal;
