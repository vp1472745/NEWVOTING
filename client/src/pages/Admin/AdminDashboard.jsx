// AdminDashboard.jsx (Final Version)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axois";

import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";

import AddOrganizationModal from "../../components/modals/Admin/AddOrganizationModal";
import ViewOrganizationModal from "../../components/modals/Admin/ViewOrganizationModal";
import EditOrganizationModal from "../../components/modals/Admin/EditOrganizationModal";

const AdminDashboard = () => {
  const navigate = useNavigate();  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [organization, setOrganization] = useState([]);

  const [activeTab, setActiveTab] = useState("all");

  const totalOrgs = organization.length;
  const activeOrgs = organization.filter((org) => org.orgStatus).length;
  const inactiveOrgs = organization.filter((org) => !org.orgStatus).length;

  const filteredOrganizations = organization.filter((org) => {
    if (activeTab === "active") return org.orgStatus;
    if (activeTab === "inactive") return !org.orgStatus;
    return true;
  });

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("/admin/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("adminToken");
      navigate("/");
    } catch (error) {
      localStorage.removeItem("adminToken");
      navigate("/");
    }
  };

  const handleAddOrganization = async (orgData) => {
    try {
      const response = await axios.post("/admin/org", orgData);
      fetchOrganizations();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get("/admin/org");
      setOrganization(response.data.organizations);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  };

  const handleUpdateOrganization = async (id, orgData) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(`/admin/org/${id}`, orgData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      fetchOrganizations();
      setIsEditModalOpen(false);
      return response.data;
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleDeleteOrganization = async (orgId) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) return;
  
    try {
      await axios.delete(`/admin/org/${orgId}`);
      // Refresh or update the organization list after delete
      fetchOrganization(); // Assuming you have this to refresh data
    } catch (error) {
      console.error("Failed to delete organization:", error);
    }
  };
  

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const orgResponse = await axios.get(`/admin/org/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const currentOrg = orgResponse.data.organization;

      await axios.patch(`/admin/org/${id}`, 
        { orgStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Mail password only when activating
      if (newStatus === true && currentOrg.orgStatus === false) {
        await axios.post('/admin/send-org-credentials', {
          orgEmail: currentOrg.orgEmail
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchOrganizations();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`bg-white rounded-lg shadow-md p-6 transition-all ${
              activeTab === "all" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Total Organizations</h3>
            <p className="text-3xl font-bold text-blue-600">{totalOrgs}</p>
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`bg-white rounded-lg shadow-md p-6 transition-all ${
              activeTab === "active" ? "ring-2 ring-green-500" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Active Organizations</h3>
            <p className="text-3xl font-bold text-green-600">{activeOrgs}</p>
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`bg-white rounded-lg shadow-md p-6 transition-all ${
              activeTab === "inactive" ? "ring-2 ring-red-500" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Inactive Organizations</h3>
            <p className="text-3xl font-bold text-red-600">{inactiveOrgs}</p>
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {activeTab === "active"
              ? "Active Organizations"
              : activeTab === "inactive"
              ? "Inactive Organizations"
              : "All Organizations"}
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Add Organization
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <div key={org._id} className="bg-white rounded-lg shadow-md p-6 relative">
              <div className="absolute top-4 right-4">
                {org.orgStatus ? (
                  <span className="text-green-500 text-xl">✓</span>
                ) : (
                  <span className="text-red-500 text-xl">✕</span>
                )}
              </div>

              <div className="flex items-center mb-4">
                <img
                  src={org.orgLogo}
                  alt={org.orgName}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{org.orgName}</h3>
                  <p className="text-gray-600">{org.orgType}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{org.orgDescription}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedOrg(org);
                      setIsViewModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrg(org);
                      setIsEditModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteOrganization(org._id)}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Delete Organization"
                   
                  >
                    <FaTrash />
                  </button>
                </div>
                <button
                  onClick={() => handleStatusUpdate(org._id, !org.orgStatus)}
                  className={`px-3 py-1 rounded ${
                    org.orgStatus
                      ? "text-red-600 hover:bg-red-50"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                >
                  {org.orgStatus ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No organizations found for the selected filter.
          </div>
        )}
      </main>

      <AddOrganizationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddOrganization}
      />
      <ViewOrganizationModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        organization={selectedOrg}
      />
      <EditOrganizationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        organization={selectedOrg}
        onSubmit={handleUpdateOrganization}
      />
    </div>
  );
};

export default AdminDashboard;
