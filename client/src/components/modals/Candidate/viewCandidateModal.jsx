import React from 'react';
import { FiUser } from 'react-icons/fi';

const ViewCandidateModal = ({ isOpen, onClose, candidate }) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiUser className="text-blue-600" /> Candidate Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg text-gray-800">{candidate.candidateName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg text-gray-800">{candidate.candidateEmail}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Position</p>
            <p className="text-lg text-gray-800">{candidate.appliedPost}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className={`text-lg font-medium ${candidate.status === 'approved' ? 'text-green-600' : candidate.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
              {candidate.status || 'Pending'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date Applied</p>
            <p className="text-lg text-gray-800">
              {new Date(candidate.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCandidateModal;