import React, { useState, useEffect } from 'react';
import axios from '../../config/axois';
import AddCandidateModal from '../../components/modals/Candidate/AddCandidateModal';
import { FiUser, FiCheckCircle, FiXCircle, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BsGraphUp } from 'react-icons/bs';
import { RiUserSearchLine } from 'react-icons/ri';
import ViewCandidateModal from '../../components/modals/Candidate/viewCandidateModal';
import EditCandidateModal from '../../components/modals/Candidate/EditCandidateModal';

const CandidateDashboard = () => {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0 });
  const [candidates, setCandidates] = useState([]);
  const [showAllCandidates, setShowAllCandidates] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  const handleEditCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setIsEditModalOpen(true);
  };

  const handleUpdateCandidate = (updatedCandidate) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate._id === updatedCandidate._id ? updatedCandidate : candidate
      )
    );
    setIsEditModalOpen(false);
  };

  const handleAddCandidate = (newCandidate) => {
    setCandidates((prev) => [...prev, newCandidate]);
    fetchCandidateStats();
  };

  useEffect(() => {
    const candidateId = localStorage.getItem('candidateId');
    if (candidateId) {
      fetchCandidateData(candidateId);
      fetchCandidateStats();
      fetchAllCandidates();
    }
  }, []);

  const fetchAllCandidates = async () => {
    try {
      const candidateId = localStorage.getItem('candidateId');
      if (!candidateId) throw new Error('Candidate ID not found');

      const res = await axios.get(`/candidate/${candidateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.data.success) {
        setCandidates([res.data.candidate]);

        // Update stats from status
        if (res.data.candidate.status) {
          setStats(prevStats => ({
            ...prevStats,
            approved: res.data.candidate.status === 'approved' ? 1 : 0,
            rejected: res.data.candidate.status === 'rejected' ? 1 : 0
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching candidate:', error);
    }
  };

  const fetchCandidateData = async (id) => {
    try {
      const res = await axios.get(`/candidate/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) setCandidateData(res.data.candidate);
      else setError(res.data.message || 'Failed to fetch candidate data');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch candidate data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateStats = async () => {
    try {
      const res = await axios.get('/candidate/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) {
        setStats({
          total: res.data.total || candidates.length,
          approved: res.data.approved || candidates.filter(c => c.status === 'approved').length,
          rejected: res.data.rejected || candidates.filter(c => c.status === 'rejected').length,
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.candidateEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.appliedPost?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  if (error) return <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto mt-8 text-red-700">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Candidate Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track all candidate activities</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus className="text-lg" /> Add New Candidate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[{ label: 'Total Candidates', value: stats.total, icon: <FiUser />, color: 'blue' },
          { label: 'Approved', value: stats.approved, icon: <FiCheckCircle />, color: 'green' },
          { label: 'Rejected', value: stats.rejected, icon: <FiXCircle />, color: 'red' }].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${color}-500 ${label === 'Total Candidates' ? 'cursor-pointer hover:shadow-md' : ''}`}
            onClick={() => label === 'Total Candidates' && setShowAllCandidates(!showAllCandidates)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-3xl font-semibold text-gray-800 mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>{icon}</div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center"><BsGraphUp className="mr-1" />{label === 'Total Candidates' ? 'All registered' : label === 'Approved' ? 'Successfully approved' : 'Not qualified'}</div>
              {label === 'Total Candidates' && (showAllCandidates ? <FiChevronUp /> : <FiChevronDown />)}
            </div>
          </div>
        ))}
      </div>

      {/* Candidates Table */}
      {showAllCandidates && (
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="px-6 py-5 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">All Candidates</h3>
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiUserSearchLine className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Position', 'Status', 'Date Applied'].map(head => (
                    <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCandidates.map((candidate, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{candidate.candidateName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{candidate.candidateEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{candidate.appliedPost}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      candidate.status === 'approved' ? 'text-green-600' :
                      candidate.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {candidate.status || 'Pending'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewCandidate(candidate)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditCandidate(candidate)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Candidate Modal */}
      <ViewCandidateModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        candidate={selectedCandidate}
      />

      {/* Edit Candidate Modal */}
      <EditCandidateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        candidate={selectedCandidate}
        onUpdate={handleUpdateCandidate}
      />

      <AddCandidateModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onAddCandidate={handleAddCandidate} />
    </div>
  );
};

export default CandidateDashboard;
