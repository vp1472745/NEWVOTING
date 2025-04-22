import React, { useState, useEffect } from "react";
import axios from "../../../config/axois";

const EditElectionModal = ({ isOpen, onClose, election, onUpdate }) => {
  const [formData, setFormData] = useState({
    electionName: "",
    electionDate: "",
    electionStartTime: "",
    electionEndTime: "",
    electionStatus: false,
    electionPosition: [],
  });

  useEffect(() => {
    if (election) {
      setFormData({
        ...election,
        electionDate: new Date(election.electionDate)
          .toISOString()
          .split("T")[0],
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

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold">Election Positions</label>
              <button
                type="button"
                onClick={addPosition}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Add Position
              </button>
            </div>
            {formData.electionPosition.map((position, index) => (
              <div key={index} className="border p-4 rounded mb-2">
                <div className="flex justify-between mb-2">
                  <h4>Position {index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePosition(index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="mb-2">
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
                    className="w-full border p-2 rounded mb-2"
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
                    className="w-full border p-2 rounded"
                    rows="2"
                    required
                  />
                </div>
              </div>
            ))}
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
