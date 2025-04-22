import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ViewOrganizationModal = ({ isOpen, onClose, organization }) => {
  if (!isOpen || !organization) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Organization Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center">
            <img
              src={organization.orgLogo}
              alt={organization.orgName}
              className="w-24 h-24 rounded-full object-cover mr-6"
            />
            <div>
              <h3 className="text-xl font-semibold">{organization.orgName}</h3>
              <p className="text-gray-600">{organization.orgType}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                organization.orgStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {organization.orgStatus ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Email</h4>
              <p>{organization.orgEmail}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Phone</h4>
              <p>{organization.orgPhone}</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-700">Address</h4>
              <p>{organization.orgAddress}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Website</h4>
              <a href={organization.orgWebsite} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline">
                {organization.orgWebsite}
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-gray-600">{organization.orgDescription}</p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrganizationModal;