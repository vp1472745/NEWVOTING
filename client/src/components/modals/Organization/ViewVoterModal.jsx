import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ViewVoterModal = ({ isOpen, onClose, voter }) => {
  if (!isOpen || !voter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Voter Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold text-gray-800">{voter.voterName}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-800">{voter.voterEmail}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold text-gray-800">{voter.voterPhone}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              voter.voterStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {voter.voterStatus ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Voter ID</p>
            <p className="font-semibold text-gray-800">{voter.voterId}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-semibold text-gray-800">{new Date(voter.dob).toLocaleDateString()}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-semibold text-gray-800">{voter.gender}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Registration Date</p>
            <p className="font-semibold text-gray-800">{new Date(voter.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="col-span-1 sm:col-span-2 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-semibold text-gray-800">{voter.voterAddress}</p>
          </div>
          {voter.notes && (
            <div className="col-span-1 sm:col-span-2 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Notes</p>
              <p className="font-semibold text-gray-800">{voter.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end sticky bottom-0 bg-white pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewVoterModal; 