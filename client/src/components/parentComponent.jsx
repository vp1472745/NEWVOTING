import React from 'react';
import CandidateDashboard from './candidate/CandidateDashboard';
import { useAuth } from '../context/AuthContext';

const ParentComponent = () => {
  const { user } = useAuth();
  const candidateId = localStorage.getItem('candidateId'); // Retrieve candidate ID from local storage

  return (
    <div>
      <CandidateDashboard candidateId={candidateId} />
    </div>
  );
};

export default ParentComponent;