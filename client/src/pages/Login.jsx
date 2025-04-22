import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axois";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [userType, setUserType] = useState("voter");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let endpoint = "";
      let userData = {};

      switch (userType) {
        case "organization":
          endpoint = "/org/login";
          userData = {
            orgEmail: formData.email,
            orgPassword: formData.password,
          };
          break;
        case "candidate":
          endpoint = "/candidate/login";
          userData = {
            candidateEmail: formData.email,
            candidatePassword: formData.password,
          };
          break;
        case "voter":
          endpoint = "/voter/login";
          userData = {
            voterEmail: formData.email,
            voterPassword: formData.password,
          };
          break;
        default:
          throw new Error("Invalid user type");
      }

      const response = await axios.post(endpoint, userData);
      if (response.data.success) {
        // ✅ Save ID based on user type
        const userIdKey =
          userType === "candidate"
            ? "candidateId"
            : userType === "organization"
            ? "orgId"
            : "voterId";

        localStorage.setItem(userIdKey, response.data[userIdKey]);

        // ✅ Save additional data if needed
        if (userType === "candidate") {
          localStorage.setItem("candidateName", response.data.candidate.candidateName);
          localStorage.setItem("appliedPost", response.data.candidate.appliedPost);
        }

        // ✅ Call global login handler
        const path = await login(response.data, userType);

        navigate(path);
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-center space-x-6">
            {["candidate", "organization", "voter"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  value={type}
                  checked={userType === type}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder={`${userType.charAt(0).toUpperCase() + userType.slice(1)} Email`}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              placeholder={`${userType.charAt(0).toUpperCase() + userType.slice(1)} Password`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login as {userType}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
