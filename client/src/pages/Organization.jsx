import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axois";
import {
  FaHome,
  FaVoteYea,
  FaUsers,
  FaUserTie,
  FaSignOutAlt,
  FaEdit,
  FaBars,
} from "react-icons/fa";
import useScrollToTop from "../hooks/useScrollToTop.jsx";

import EditOrgModal from "../components/modals/Organization/EditOrgModal.jsx";
import LogoutModal from "../components/modals/LogoutModal.jsx";
import ElectionsTab from "../components/organizationTabs/ElectionsTab";
import VotersTab from "../components/organizationTabs/VotersTab";
import CandidatesTab from "../components/organizationTabs/CandidateTab.jsx";

const Organization = () => {
  useScrollToTop(); // Add auto-scroll to top functionality

  const [organization, setOrganization] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    fetchOrgDetails();
  }, []);

  // Handle click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchOrgDetails = async () => {
    try {
      const res = await axios.get("/org/");
      if (res.data.success) setOrganization(res.data.organization);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/org/logout");
      // Clear any local storage items if they exist
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if the logout request fails, we should still clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false); // Auto-collapse sidebar after tab change
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, id: "dashboard" },
    { name: "Elections", icon: <FaVoteYea />, id: "elections" },
    { name: "Candidates", icon: <FaUserTie />, id: "candidates" },
    { name: "Voters", icon: <FaUsers />, id: "voters" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button - Only visible on mobile */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle lg:hidden fixed top-20 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
      >
        <FaBars />
      </button>

      <div className="flex h-screen">
        <aside
          ref={sidebarRef}
          className={`fixed lg:static lg:block w-64 bg-white shadow transition-all duration-300 h-full ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 border-b">
            <img
              src={organization?.orgLogo || "/default-logo.png"}
              alt="Logo"
              className="w-32 h-32 mx-auto rounded-full object-cover"
            />
          </div>
          <nav className="mt-4 h-[calc(100%-12rem)] overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center px-4 py-2 text-left hover:bg-blue-100 ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto lg:mt-0 mt-10">
          {activeTab === "dashboard" && organization && (
            <div className="bg-white p-4 sm:p-6 rounded shadow">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold">Organization Info</h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                >
                  <FaEdit className="inline mr-2" /> Edit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">
                    {organization.orgName}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">
                    {organization.orgEmail}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-800">
                    {organization.orgPhone}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-800">
                    {organization.orgAddress}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold text-gray-800">
                    {organization.orgType}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Status</p>
                  <p
                    className={`font-semibold ${
                      organization.orgStatus ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {organization.orgStatus ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Website</p>
                  <a
                    href={organization.orgWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {organization.orgWebsite}
                  </a>
                </div>
                <div className="col-span-1 sm:col-span-2 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-semibold text-gray-800">
                    {organization.orgDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "elections" && <ElectionsTab />}
          {activeTab === "candidates" && <CandidatesTab />}
          {activeTab === "voters" && <VotersTab />}
        </main>

        <EditOrgModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          organization={organization}
          onUpdate={fetchOrgDetails}
        />

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
};

export default Organization;
