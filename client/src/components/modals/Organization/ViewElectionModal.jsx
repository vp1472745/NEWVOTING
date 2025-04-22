import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ViewElectionModal = ({ isOpen, onClose, election }) => {
          if (!isOpen || !election) return null;
        
          return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto px-8 py-6">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Election Overview</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition duration-150">
                <FaTimes className="text-2xl" />
              </button>
            </div>
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div>
                <p className="text-sm text-gray-500 mb-1">Election Name</p>
                <p className="text-lg font-medium">{election.electionName}</p>
              </div>
        
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="text-lg">{new Date(election.electionDate).toLocaleDateString()}</p>
              </div>
        
              <div>
                <p className="text-sm text-gray-500 mb-1">Time</p>
                <p className="text-lg">{election.electionStartTime} – {election.electionEndTime}</p>
              </div>
        
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium 
                  ${election.electionStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {election.electionStatus ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
        
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Election Positions</h3>
              <div className="space-y-4">
                {election.electionPosition.map((position, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-md font-bold text-gray-800">{position.positionName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{position.positionDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        
          );
        };

        export default ViewElectionModal;