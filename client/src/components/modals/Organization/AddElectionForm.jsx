import React, { useState } from "react";
import axios from "../../../config/axois";


const AddElectionForm = ({ isOpen, onClose }) => {
  const initialFormState = {
    electionName: "",
    electionDate: "",
    electionStartTime: "",
    electionEndTime: "",
    electionStatus: false,
    electionPosition: [
      {
        positionName: "",
        positionDescription: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/election/create", formData);
      setFormData(initialFormState); // Reset form to initial state
      onClose();
    } catch (error) {
      console.error("Create election error:", error);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create New Election
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Election Name
            </label>
            <input
              name="electionName"
              value={formData.electionName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Election Date
            </label>
            <input
              type="date"
              name="electionDate"
              value={formData.electionDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="electionStartTime"
                value={formData.electionStartTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                name="electionEndTime"
                value={formData.electionEndTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Election Positions
              </label>
              <button
                type="button"
                onClick={addPosition}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
              >
                Add Position
              </button>
            </div>

            {formData.electionPosition.map((position, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">
                    Position {index + 1}
                  </h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePosition(index)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  placeholder="Position Name"
                  value={position.positionName}
                  onChange={(e) =>
                    handlePositionChange(
                      index,
                      "positionName",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Position Description"
                  value={position.positionDescription}
                  onChange={(e) =>
                    handlePositionChange(
                      index,
                      "positionDescription",
                      e.target.value
                    )
                  }
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Create Election
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddElectionForm;