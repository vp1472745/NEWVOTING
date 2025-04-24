import React, { useState, useEffect } from "react";
import axios from "../../../config/axois";

const EditVoterModals = ({ voter, open, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    voterName: "",
    voterEmail: "",
    voterPhone: "",
    voterAddress: "",
    voterGender: "",
    voterAge: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (voter) {
      setForm({
        voterName: voter.voterName || "",
        voterEmail: voter.voterEmail || "",
        voterPhone: voter.voterPhone || "",
        voterAddress: voter.voterAddress || "",
        voterGender: voter.voterGender || "",
        voterAge: voter.voterAge || "",
      });
    }
  }, [voter, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.put(`/voter/${voter._id}`, form);
      
      if (res.data.success) {
        onUpdate(res.data.voter);
        onClose();
      } else {
        setError(res.data.message || "Update failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Edit Voter Profile</h2>
        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="voterName"
              value={form.voterName}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="voterEmail"
              value={form.voterEmail}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="voterPhone"
              value={form.voterPhone}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="voterAddress"
              value={form.voterAddress}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="voterGender"
              value={form.voterGender}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="voterAge"
              value={form.voterAge}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
              min={18}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVoterModals;