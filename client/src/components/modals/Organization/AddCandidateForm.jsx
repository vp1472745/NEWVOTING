import React, { useState, useEffect } from "react";
import axios from "../../../config/axois";
import PropTypes from "prop-types";

const AddCandidateModal = ({ isOpen, onClose, onAddCandidate = () => {} }) => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [posts, setPosts] = useState([]);

  // Add the candidateAgenda field to initialFormState
  const initialFormState = {
    candidateName: "",
    candidateEmail: "",
    candidatePassword: "",
    candidateAddress: "",
    candidatePhone: "",
    candidateImage: null,
    candidatePayImage: null,
    candidateGender: "",
    candidateAge: "",
    candidateStatus: false,
    appliedPost: "",
    election: "",
    candidateAgenda: "", // New field for agenda
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch elections on component mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get("/election/all"); // Updated endpoint
        if (res.data.success) {
          setElections(res.data.elections);
        } else {
          console.error("Failed to fetch elections:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching elections:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
      }
    };

    if (isOpen) {
      fetchElections();
    }
  }, [isOpen]); // Added isOpen as dependency

  // Fetch posts when election is selected
  useEffect(() => {
    if (selectedElection) {
      const fetchPosts = async () => {
        try {
          const selectedElectionData = elections.find(
            (election) => election._id === selectedElection
          );
          if (selectedElectionData && selectedElectionData.electionPosition) {
            setPosts(selectedElectionData.electionPosition);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      fetchPosts();
    }
  }, [selectedElection, elections]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleElectionChange = (e) => {
    const electionId = e.target.value;
    setSelectedElection(electionId);
    setFormData({ ...formData, election: electionId });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "voting"); // Replace with your Cloudinary upload preset

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dxshlpvcx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.candidateImage || !formData.candidatePayImage) {
        throw new Error("Please upload both candidate image and payment proof");
      }

      // Get the selected post name
      const selectedPost = posts.find(
        (post) => post._id === formData.appliedPost
      );
      if (!selectedPost) {
        throw new Error("Selected post not found");
      }

      // Upload images to Cloudinary
      const candidateImageUrl = await uploadToCloudinary(
        formData.candidateImage
      );
      const candidatePayImageUrl = await uploadToCloudinary(
        formData.candidatePayImage
      );

      // Prepare data for backend
      const candidateData = {
        ...formData,
        appliedPost: selectedPost.positionName, // Save the post name instead of ID
        candidateImage: candidateImageUrl,
        candidatePayImage: candidatePayImageUrl,
      };

      // Remove file objects and candidateStatus from data
      delete candidateData.candidateImageFile;
      delete candidateData.candidatePayImageFile;
      delete candidateData.candidateStatus;

      // Send data to backend
      const response = await axios.post("/candidate/register", candidateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        onAddCandidate(response.data.candidate);
        setFormData(initialFormState);
        setSelectedElection("");
        setPosts([]);
        onClose();
      } else {
        console.error("Failed to add candidate:", response.data.message);
        alert(response.data.message || "Failed to add candidate");
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(error.response.data.message || "An error occurred");
      } else {
        alert(error.message || "An error occurred");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Candidate
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 pb-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          {/* Election Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Election
            </label>
            <select
              name="election"
              value={selectedElection}
              onChange={handleElectionChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select an election</option>
              {elections.map((election) => (
                <option key={election._id} value={election._id}>
                  {election.electionName}
                </option>
              ))}
            </select>
          </div>

          {/* Post Dropdown */}
          {selectedElection && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Applied Post
              </label>
              <select
                name="appliedPost"
                value={formData.appliedPost}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a post</option>
                {posts.map((post) => (
                  <option key={post._id} value={post._id}>
                    {post.positionName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add these form fields before the submit button */}
          <div className="space-y-5">
            {/* Candidate Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Candidate Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="candidateEmail"
                value={formData.candidateEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Candidate Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="candidatePassword"
                value={formData.candidatePassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Candidate Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                name="candidateAddress"
                value={formData.candidateAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Candidate Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="candidatePhone"
                value={formData.candidatePhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Candidate Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="candidateGender"
                value={formData.candidateGender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Candidate Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="candidateAge"
                value={formData.candidateAge}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Candidate Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Image
              </label>
              <input
                type="file"
                name="candidateImage"
                onChange={(e) => setFormData({ ...formData, candidateImage: e.target.files[0] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* Candidate Payment Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Proof Image
              </label>
              <input
                type="file"
                name="candidatePayImage"
                onChange={(e) => setFormData({ ...formData, candidatePayImage: e.target.files[0] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* Candidate Agenda (New field) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Agenda
              </label>
              <textarea
                name="candidateAgenda"
                value={formData.candidateAgenda}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Enter your agenda or statement"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Add Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddCandidateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddCandidate: PropTypes.func,
};

export default AddCandidateModal;
