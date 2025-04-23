import React, { useState, useEffect } from "react";
import axios from "../config/axois";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiEdit2, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CandidateDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    candidateStatus: "pending", // Changed to string type to match backend
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.type !== "candidate") {
        navigate("/"); // Redirect if not candidate
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
        const candidate = res.data.candidate;
        setCandidateData(candidate);
        setFormData({
          candidateName: candidate.candidateName || "",
          candidateEmail: candidate.candidateEmail || "",
          candidateAddress: candidate.candidateAddress || "",
          candidatePhone: candidate.candidatePhone || "",
          candidateGender: candidate.candidateGender || "",
          candidateAge: candidate.candidateAge || "",
          candidateImage: candidate.candidateImage || "",
          candidateStatus: candidate.candidateStatus || "pending", // Ensure status is set
        });
      } else {
        setError(res.data.message || "Failed to fetch candidate data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || 
        "Failed to fetch candidate data. Please try again."
      );
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
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "voting");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dxshlpvcx/image/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.secure_url) {
        // Update both form data and make API call to save
        const updatedFormData = {
          ...formData,
          candidateImage: data.secure_url,
        };
        
        const updateResponse = await axios.put(
          `/candidate/update`,
          updatedFormData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (updateResponse.data.success) {
          setFormData(updatedFormData);
          setCandidateData(updateResponse.data.candidate);
          setError(null);
        } else {
          throw new Error("Failed to update profile with new image");
        }
      } else {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(`/candidate/update`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      if (res.data.success) {
        setCandidateData(res.data.candidate);
        setIsEditing(false);
        setError(null);
      } else {
        throw new Error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          {error}
          <button 
            onClick={fetchCandidateData}
            className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p>No candidate data found</p>
          <button 
            onClick={fetchCandidateData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            disabled={loading}
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
                    disabled={loading}
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
                    disabled={!isEditing || loading}
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
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
                    disabled
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
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
                    disabled={!isEditing || loading}
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                    disabled={!isEditing || loading}
                    min="18"
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                    disabled={!isEditing || loading}
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  <div className="mt-2">
                    {getStatusBadge(formData.candidateStatus)}
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
                    disabled={!isEditing || loading}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
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