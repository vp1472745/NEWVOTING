import React, { useState, useEffect } from "react";
import axios from "../../../config/axois";
import { FaTimes } from "react-icons/fa";

const EditOrgModal = ({ isOpen, onClose, organization, onUpdate }) => {
  const [formData, setFormData] = useState({
    orgName: "",
    orgEmail: "",
    orgAddress: "",
    orgPhone: "",
    orgLogo: "",
    orgDescription: "",
    orgWebsite: "",
    orgType: "",
    orgStatus: true,
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        orgName: organization.orgName || "",
        orgEmail: organization.orgEmail || "",
        orgAddress: organization.orgAddress || "",
        orgPhone: organization.orgPhone || "",
        orgLogo: organization.orgLogo || "",
        orgDescription: organization.orgDescription || "",
        orgWebsite: organization.orgWebsite || "",
        orgType: organization.orgType || "",
        orgStatus: organization.orgStatus || false,
      });
    }
  }, [organization]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/org/", formData);
      if (response.data.success) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!isOpen || !organization) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Organization</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={formData.orgName}
                onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-md p-2"
                value={formData.orgEmail}
                onChange={(e) => setFormData({...formData, orgEmail: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                className="w-full border rounded-md p-2"
                value={formData.orgPhone}
                onChange={(e) => setFormData({...formData, orgPhone: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full border rounded-md p-2"
                value={formData.orgType}
                onChange={(e) => setFormData({...formData, orgType: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                <option value="Government">Government</option>
                <option value="Local Government">Local Government</option>
                <option value="Private">Private</option>
                <option value="Non-Profit">Non-Profit</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={formData.orgAddress}
                onChange={(e) => setFormData({...formData, orgAddress: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                className="w-full border rounded-md p-2"
                value={formData.orgWebsite}
                onChange={(e) => setFormData({...formData, orgWebsite: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input
                type="url"
                className="w-full border rounded-md p-2"
                value={formData.orgLogo}
                onChange={(e) => setFormData({...formData, orgLogo: e.target.value})}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2"
                value={formData.orgDescription}
                onChange={(e) => setFormData({...formData, orgDescription: e.target.value})}
                required
                rows="3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.orgStatus}
                  onChange={(e) => setFormData({...formData, orgStatus: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm font-medium">Active Status</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrgModal;
