// src/components/Navbar.jsx
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-teal-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-bold">TECTONA Inventory</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block">Welcome, {user.username}</span>
          <button
            onClick={handleLogout}
            className="btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;