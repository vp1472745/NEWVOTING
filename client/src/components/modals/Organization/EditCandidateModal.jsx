import React, { useState, useEffect } from "react";
import axios from "../../../config/axois";
import { FaTimes, FaSpinner } from "react-icons/fa";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit } from 'react-icons/fi';

const EditCandidateModal = ({ isOpen, onClose, candidate, onUpdate }) => {
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidateAddress: "",
    candidatePhone: "",
    candidateGender: "",
    candidateAge: "",
    candidateStatus: "pending",
    appliedPost: "",
    candidateImage: null,
    candidatePayImage: null,
    candidateAgenda: "" // Added agenda field
  });

  const [imagePreview, setImagePreview] = useState({
    candidateImage: "",
    candidatePayImage: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        candidateName: candidate.candidateName || "",
        candidateEmail: candidate.candidateEmail || "",
        candidateAddress: candidate.candidateAddress || "",
        candidatePhone: candidate.candidatePhone || "",
        candidateGender: candidate.candidateGender || "",
        candidateAge: candidate.candidateAge || "",
        candidateStatus: candidate.candidateStatus || "pending",
        appliedPost: candidate.appliedPost || "",
        candidateImage: candidate.candidateImage || null,
        candidatePayImage: candidate.candidatePayImage || null,
        candidateAgenda: candidate.candidateAgenda || "" // Set agenda if exists
      });

      setImagePreview({
        candidateImage: candidate.candidateImage || "",
        candidatePayImage: candidate.candidatePayImage || ""
      });
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "voting");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dxshlpvcx/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const candidateImageUrl =
        formData.candidateImage instanceof File
          ? await uploadToCloudinary(formData.candidateImage)
          : formData.candidateImage;

      const candidatePayImageUrl =
        formData.candidatePayImage instanceof File
          ? await uploadToCloudinary(formData.candidatePayImage)
          : formData.candidatePayImage;

      const validStatuses = ["pending", "approved", "rejected"];
      const status = validStatuses.includes(formData.candidateStatus)
        ? formData.candidateStatus
        : "pending";

      const candidateData = {
        ...formData,
        candidateStatus: status,
        candidateImage: candidateImageUrl,
        candidatePayImage: candidatePayImageUrl,
      };

      const response = await axios.put(
        `/candidate/update/${candidate._id}`,
        candidateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        onUpdate(response.data.candidate);
        onClose();
      } else {
        setError(response.data.message || "Failed to update candidate");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file
      }));
      setImagePreview((prev) => ({
        ...prev,
        [field]: URL.createObjectURL(file)
      }));
    }
  };

  if (!isOpen || !candidate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FiEdit className="text-white text-xl" />
              <h2 className="text-xl font-semibold text-white">Edit Candidate</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition p-1 rounded-full"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-4 rounded">
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "candidateImage")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {imagePreview.candidateImage && (
                  <img
                    src={imagePreview.candidateImage}
                    alt="Candidate"
                    className="mt-2 h-24 w-24 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Proof
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "candidatePayImage")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {imagePreview.candidatePayImage && (
                  <img
                    src={imagePreview.candidatePayImage}
                    alt="Payment Proof"
                    className="mt-2 h-24 w-24 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {[ 
                { label: "Full Name", name: "candidateName", type: "text" },
                { label: "Email", name: "candidateEmail", type: "email" },
                { label: "Address", name: "candidateAddress", type: "text" },
                { label: "Phone", name: "candidatePhone", type: "tel" },
                { label: "Age", name: "candidateAge", type: "number", min: 18 },
                { label: "Agenda", name: "candidateAgenda", type: "text" } // New field
              ].map(({ label, name, type, min }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    min={min}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="candidateGender"
                  value={formData.candidateGender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="candidateStatus"
                  value={formData.candidateStatus}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Candidate"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

EditCandidateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  candidate: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default EditCandidateModal;
