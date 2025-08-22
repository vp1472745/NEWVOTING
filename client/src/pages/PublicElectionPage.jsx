import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../config/axois";

const CandidateApplyPage = () => {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPostDesc, setSelectedPostDesc] = useState("");
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
    appliedPost: "",
    candidateAgenda: "",
  };
  const [form, setForm] = useState(initialFormState);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/election/${id}`)
      .then(res => {
        setElection(res.data.election); // <-- fix here
        setPosts(res.data.election.electionPosition || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Election not found");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Show description of selected post
    const post = posts.find(p => p._id.toString() === form.appliedPost);
    setSelectedPostDesc(post?.positionDescription || "");
  }, [form.appliedPost, posts]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "voting");
    const res = await fetch("https://api.cloudinary.com/v1_1/dxshlpvcx/image/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!form.candidateImage || !form.candidatePayImage) {
        setError("Please upload both candidate image and payment proof");
        return;
      }
      const selectedPost = posts.find(post => post._id === form.appliedPost);
      if (!selectedPost) {
        setError("Selected post not found");
        return;
      }
      const candidateImageUrl = await uploadToCloudinary(form.candidateImage);
      const candidatePayImageUrl = await uploadToCloudinary(form.candidatePayImage);

      const candidateData = {
        ...form,
        appliedPost: selectedPost.positionName,
        candidateImage: candidateImageUrl,
        candidatePayImage: candidatePayImageUrl,
        election: id,
        candidateStatus: "pending"
      };

      await axios.post("/candidate/register", candidateData);

      setSuccess("Applied successfully!");
      setForm(initialFormState);
      setError("");
    } catch (err) {
      setError("Failed to apply. Try again.");
      setSuccess("");
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (error) return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow text-red-600 text-lg font-semibold">{error}</div>
    </div>
  );
  if (!election) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 via-blue-50 to-white flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[95vh] flex flex-col overflow-y-auto border border-indigo-100">
        <div className="p-8 border-b text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">
            Candidate Apply Form
          </h2>
          <p className="text-gray-500 text-base mb-1">
            Fill this form to apply as a <span className="font-semibold text-indigo-700">candidate</span> for <span className="font-semibold">{election.electionName}</span>
          </p>
          {election.organization?.name && (
            <p className="text-gray-500 text-base mb-1">
              Organized by <span className="font-semibold">{election.organization.name}</span>
            </p>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 px-8 pb-8 pt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="candidateName"
                placeholder="Name"
                value={form.candidateName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="candidateEmail"
                placeholder="Email"
                value={form.candidateEmail}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="candidatePassword"
                placeholder="Password"
                value={form.candidatePassword || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="candidatePhone"
                placeholder="Phone"
                value={form.candidatePhone || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="candidateAddress"
                placeholder="Address"
                value={form.candidateAddress || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
              <select
                name="candidateGender"
                value={form.candidateGender || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="candidateAge"
                placeholder="Age"
                value={form.candidateAge || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Applied Post</label>
              <select
                name="appliedPost"
                value={form.appliedPost}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              >
                <option value="">Select Post</option>
                {posts.map((post) => (
                  <option key={post._id} value={post._id.toString()}>
                    {post.positionName}
                  </option>
                ))}
              </select>
              {selectedPostDesc && (
                <div className="mt-2 text-xs text-gray-500 bg-indigo-50 rounded px-2 py-1">
                  <span className="font-semibold text-indigo-700">Description: </span>
                  {selectedPostDesc}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Candidate Image</label>
              <input
                type="file"
                name="candidateImage"
                onChange={handleFileChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Proof Image</label>
              <input
                type="file"
                name="candidatePayImage"
                onChange={handleFileChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Candidate Agenda</label>
            <textarea
              name="candidateAgenda"
              placeholder="Enter your agenda or statement"
              value={form.candidateAgenda}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow hover:from-indigo-700 hover:to-blue-600 transition"
          >
            Submit Application
          </button>
          {success && <div className="text-green-600 font-medium text-center mt-2">{success}</div>}
          {error && <div className="text-red-600 font-medium text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default CandidateApplyPage;