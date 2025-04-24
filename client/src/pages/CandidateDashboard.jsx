import React, { useState, useEffect } from "react";
import axios from "../config/axois";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiEdit2, FiCamera, FiUpload, FiSave, FiX } from "react-icons/fi";
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
    candidateStatus: "pending",
    candidateAgenda: "",
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.type !== "candidate") {
        navigate("/");
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
          candidateStatus: candidate.candidateStatus || "pending",
          candidateAgenda: candidate.candidateAgenda || "",
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
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider";
    
    switch (status) {
      case "approved":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Rejected
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending Review
          </span>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <button 
                onClick={fetchCandidateData}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No candidate data found</h3>
            <div className="mt-6">
              <button 
                onClick={fetchCandidateData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Candidate Profile</h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${isEditing ? "bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500" : "bg-white/10 text-white hover:bg-white/20 focus:ring-white"}`}
                  disabled={loading}
                >
                  {isEditing ? (
                    <>
                      <FiX className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FiEdit2 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </button>
                {!isEditing && (
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    View Results
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="w-full lg:w-1/3">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-md">
                        {formData.candidateImage ? (
                          <img
                            src={formData.candidateImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiUser className="w-20 h-20 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <>
                          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transform transition hover:scale-105">
                            <FiCamera className="w-5 h-5" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={loading}
                            />
                          </label>
                          
                        </>
                      )}
                    </div>

                    <div className="mt-6 w-full">
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800">{formData.candidateName}</h2>
                        <p className="text-sm text-gray-500">{formData.candidateEmail}</p>
                      </div>

                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Status</span>
                          <div>{getStatusBadge(formData.candidateStatus)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="w-full lg:w-2/3">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="candidateName"
                          value={formData.candidateName}
                          onChange={handleInputChange}
                          disabled={!isEditing || loading}
                          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="candidateEmail"
                          value={formData.candidateEmail}
                          disabled
                          className="block w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="candidatePhone"
                          value={formData.candidatePhone}
                          onChange={handleInputChange}
                          disabled={!isEditing || loading}
                          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                          type="number"
                          name="candidateAge"
                          value={formData.candidateAge}
                          onChange={handleInputChange}
                          disabled={!isEditing || loading}
                          min="18"
                          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          name="candidateGender"
                          value={formData.candidateGender}
                          onChange={handleInputChange}
                          disabled={!isEditing || loading}
                          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Candidate Details</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          name="candidateAddress"
                          value={formData.candidateAddress}
                          onChange={handleInputChange}
                          disabled={!isEditing || loading}
                          rows="3"
                          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Agenda</label>
                        <textarea
                          name="candidateAgenda"
                          value={formData.candidateAgenda}
                          onChange={handleInputChange}
                          disabled={!isEditing || loading}
                          rows="4"
                          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                          placeholder="Share your campaign vision and goals..."
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        <FiX className="mr-2 h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;