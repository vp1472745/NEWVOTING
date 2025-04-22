import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LogoutModal from '../components/modals/LogoutModal.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const path = await logout();
      setIsLogoutModalOpen(false);
      navigate(path);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLogoutModalOpen(false);
      navigate('/');
    }
  };

  const getUserName = () => {
    if (!user) return null;
    
    switch (user.type) {
      case 'organization':
        return user.orgName;
      case 'candidate':
        return user.candidateName; // Ensure candidateName is returned
      case 'voter':
        return user.voterName;
      case 'admin':
        return 'Admin';
      default:
        return null;
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    
    switch (user.type) {
      case 'organization':
        return '/organization/dashboard';
      case 'candidate':
        return '/candidate/dashboard';
      case 'voter':
        return '/voter/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-800">
                  Voting System
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{getUserName()}</span> {/* Display user name */}
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;