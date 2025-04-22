import React, { useState, useEffect } from "react";
import axios from "../../../config/axois";

const EditVoterModal = ({ isOpen, onClose, voter }) => {
  const [formData, setFormData] = useState({
    voterName: "",
    voterEmail: "",
    voterAddress: "",
    voterPhone: "",
    voterGender: "",
    voterAge: "",
    voterStatus: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (voter) {
      setFormData({
        voterName: voter.voterName,
        voterEmail: voter.voterEmail,
        voterAddress: voter.voterAddress,
        voterPhone: voter.voterPhone,
        voterGender: voter.voterGender,
        voterAge: voter.voterAge,
        voterStatus: voter.voterStatus,
      });
    }
  }, [voter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.put(`/org/voter/update/${voter._id}`, formData);
      
      if (response.data.success) {
        onClose();
      } else {
        setError(response.data.message || "Failed to update voter");
      }
    } catch (err) {
      console.error("Update voter error:", err);
      setError(err.response?.data?.message || "Failed to update voter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !voter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Voter</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="voterName"
              value={formData.voterName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="voterEmail"
              value={formData.voterEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="voterAddress"
              value={formData.voterAddress}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="voterPhone"
              value={formData.voterPhone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="voterGender"
              value={formData.voterGender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="voterAge"
              value={formData.voterAge}
              onChange={handleChange}
              required
              min="18"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="voterStatus"
              value={formData.voterStatus}
              onChange={(e) => setFormData(prev => ({...prev, voterStatus: e.target.value === 'true'}))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Voter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVoterModal; 