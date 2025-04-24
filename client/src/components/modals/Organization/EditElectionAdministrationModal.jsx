import React, { useState, useEffect } from "react";
import axios from "../../../config/axois";

const EditElectionModal = ({ isOpen, onClose, election, onUpdate }) => {
  const [formData, setFormData] = useState({
    electionName: "",
    electionDate: "",
    electionStartTime: "",
    electionEndTime: "",
    electionStatus: "Not Started",
    electionPosition: [],
    Organization: ""
  });

  useEffect(() => {
    if (election) {
      setFormData({
        electionName: election.electionName || "",
        electionDate: new Date(election.electionDate).toISOString().split("T")[0],
        electionStartTime: election.electionStartTime || "",
        electionEndTime: election.electionEndTime || "",
        electionStatus: election.electionStatus || "Not Started",
        electionPosition: Array.isArray(election.electionPosition) 
          ? election.electionPosition 
          : [],
        Organization: typeof election.Organization === "object"
          ? election.Organization._id
          : election.Organization
      });
    }
  }, [election]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data before update:", formData);
      const response = await axios.put(
        `/election/update/${election._id}`,  // Ensure this matches backend route
        {
          ...formData,
          electionDate: new Date(formData.electionDate).toISOString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        onUpdate();   // Refresh or notify parent
        onClose();    // Close the modal
      }
    } catch (error) {
      console.error("Update error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
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
    const newPositions = formData.electionPosition.filter((_, i) => i !== index);
    setFormData({ ...formData, electionPosition: newPositions });
  };

  if (!isOpen || !election) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <option value="Polling">Polling</option>
              <option value="Completed">Completed</option>
              <option value="Results Declared">Results Declared</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Positions</label>
            {formData.electionPosition.map((pos, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <label className="block mb-1">Position Name</label>
                <input
                  value={pos.positionName}
                  onChange={(e) => handlePositionChange(index, "positionName", e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
                <label className="block mb-1">Position Description</label>
                <textarea
                  value={pos.positionDescription}
                  onChange={(e) => handlePositionChange(index, "positionDescription", e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <button
                  type="button"
                  className="mt-2 text-red-600"
                  onClick={() => removePosition(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPosition}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Position
            </button>
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
