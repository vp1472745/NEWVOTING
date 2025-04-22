import React, { useState, useEffect } from "react";
import axios from "../config/axois";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiEdit2, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CandidateDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidateAddress: "",
    candidatePhone: "",
    candidateGender: "",
    candidateAge: "",
    candidateImage: "",
    candidateStatus: false,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.type !== "candidate") {
        return;
      }
      fetchCandidateData();
    }
  }, [user, authLoading, navigate]);

  const fetchCandidateData = async () => {
    try {
      setLoading(true);
      const candidateId = user._id || user.candidateId;

      if (!candidateId) {
        setError("Candidate ID not found");
        setLoading(false);
        return;
      }

      const res = await axios.get(`/candidate/${candidateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setLoading(false);
        setCandidateData(res.data.candidate);
        setFormData({
          candidateName: res.data.candidate.candidateName || "",
          candidateEmail: res.data.candidate.candidateEmail || "",
          candidateAddress: res.data.candidate.candidateAddress || "",
          candidatePhone: res.data.candidate.candidatePhone || "",
          candidateGender: res.data.candidate.candidateGender || "",
          candidateAge: res.data.candidate.candidateAge || "",
          candidateImage: res.data.candidate.candidateImage || "",
          candidateStatus: res.data.candidate.candidateStatus || false,
        });
      } else {
        setError(res.data.message || "Failed to fetch candidate data");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to fetch candidate data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create form data for Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "voting"); // Your Cloudinary upload preset

        // Upload to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dxshlpvcx/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          // Update form data with the Cloudinary URL
          setFormData((prev) => ({
            ...prev,
            candidateImage: data.secure_url,
          }));

          // Save the updated profile with new image URL
          const updateResponse = await axios.put(
            `/candidate/update`,
            {
              ...formData,
              candidateImage: data.secure_url,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (updateResponse.data.success) {
            setCandidateData(updateResponse.data.candidate);
            setError(null);
          } else {
            setError("Failed to update profile with new image");
          }
        } else {
          setError("Failed to upload image to Cloudinary");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError("Failed to upload image");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/candidate/update`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setCandidateData(res.data.candidate);
        setIsEditing(false);
        setError(null);
      } else {
        setError(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto mt-8 text-red-700">
        {error}
      </div>
    );
  }

  if (!user || user.type !== "candidate") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FiEdit2 className="text-lg" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image Section */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gray-100">
                {formData.candidateImage ? (
                  <img
                    src={formData.candidateImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiUser className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <FiCamera className="w-6 h-6" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-2 rounded-md py-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="candidateEmail"
                    value={formData.candidateEmail}
                    // onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full py-1 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="candidatePhone"
                    value={formData.candidatePhone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="candidateAge"
                    value={formData.candidateAge}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="candidateGender"
                    value={formData.candidateGender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full py-1 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className={`mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                    formData.candidateStatus 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.candidateStatus ? 'Approved' : 'Pending'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="candidateAddress"
                    value={formData.candidateAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className="mt-1 block w-full py-1 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
