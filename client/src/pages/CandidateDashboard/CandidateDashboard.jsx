import React, { useState, useEffect } from "react";
import axios from "../../config/axois";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CandidateSidebar from "./CandidateSidebar.jsx";
import CandidateMainContent from "./CandidateMainContent.jsx";

const CandidateDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidateAddress: "",
    candidatePhone: "",
    candidateGender: "",
    candidateAge: "",
    candidateImage: "",
    candidatePayImage: "",
    appliedPost: "",
    candidateAgenda: "",
    // Add other fields as needed
  });

  // Fetch candidate data
  const fetchCandidateData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/candidate/profile");
      setCandidateData(res.data.candidate);
      setFormData({
        candidateName: res.data.candidate.candidateName || "",
        candidateEmail: res.data.candidate.candidateEmail || "",
        candidateAddress: res.data.candidate.candidateAddress || "",
        candidatePhone: res.data.candidate.candidatePhone || "",
        candidateGender: res.data.candidate.candidateGender || "",
        candidateAge: res.data.candidate.candidateAge || "",
        candidateImage: res.data.candidate.candidateImage || "",
        candidatePayImage: res.data.candidate.candidatePayImage || "",
        appliedPost: res.data.candidate.appliedPost || "",
        candidateAgenda: res.data.candidate.candidateAgenda || "",
        // Add other fields as needed
      });
      setLoading(false);
    } catch (err) {
      console.error("API error:", err); // <-- Add this line for debugging
      setError("Failed to fetch candidate data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateData();
    // eslint-disable-next-line
  }, []);

  // Edit form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put("/candidate/update", formData);
      setIsEditing(false);
      fetchCandidateData();
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  // Render edit form function for passing to main content
  const renderEditForm = () => (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="candidateName"
            value={formData.candidateName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="candidateEmail"
            value={formData.candidateEmail}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="candidateAddress"
            value={formData.candidateAddress}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="candidatePhone"
            value={formData.candidatePhone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <input
            type="text"
            name="candidateGender"
            value={formData.candidateGender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            name="candidateAge"
            value={formData.candidateAge}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Applied Post
          </label>
          <input
            type="text"
            name="appliedPost"
            value={formData.appliedPost}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agenda
          </label>
          <input
            type="text"
            name="candidateAgenda"
            value={formData.candidateAgenda}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image
          </label>
          {formData.candidateImage && (
            <img
              src={formData.candidateImage}
              alt="Candidate"
              className="w-24 h-24 object-cover rounded-full mb-2 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                try {
                  const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                      method: "POST",
                      body: data,
                    }
                  );
                  const result = await res.json();
                  setFormData((prev) => ({
                    ...prev,
                    candidateImage: result.secure_url,
                  }));
                } catch {
                  alert("Image upload failed");
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Image
          </label>
          {formData.candidatePayImage && (
            <img
              src={formData.candidatePayImage}
              alt="Payment"
              className="w-24 h-24 object-cover rounded mb-2 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                try {
                  const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                      method: "POST",
                      body: data,
                    }
                  );
                  const result = await res.json();
                  setFormData((prev) => ({
                    ...prev,
                    candidatePayImage: result.secure_url,
                  }));
                } catch {
                  alert("Image upload failed");
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
        >
          Save Changes
        </button>
        <button
          type="button"
          className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 font-semibold"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchCandidateData}
              className="mt-4 px-3 py-2 bg-red-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar active={activeTab} onNavigate={setActiveTab} />
      <div className="flex-1 p-6">
        <CandidateMainContent
          active={activeTab}
          candidateData={candidateData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          renderEditForm={renderEditForm}
        />
      </div>
    </div>
  );
};

export default CandidateDashboard;