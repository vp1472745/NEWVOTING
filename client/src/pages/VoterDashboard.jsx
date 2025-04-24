import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaVoteYea,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import DashboardTab from "../components/voterTab/DashboardTab";
import ViewTab from "../components/voterTab/ViewTab";
import PollingTab from "../components/voterTab/PollingTab";

const VoterDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/");
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
    { name: "View Candidate", icon: <FaUser />, id: "viewCandidate" },
    { name: "Polling", icon: <FaVoteYea />, id: "polling" },
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
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed lg:static lg:block w-64 bg-white shadow transition-all duration-300 h-full z-10 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800 mt-12">Voter Dashboard</h2>
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
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-left text-gray-600 hover:bg-red-100 hover:text-red-600"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto lg:mt-0 mt-10">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "viewCandidate" && <ViewTab />}
          {activeTab === "polling" && <PollingTab />}
        </main>
      </div>
    </div>
  );
};

export default VoterDashboard;
