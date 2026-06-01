import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Get initials for profile avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="nav-brand">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span>TaskFlow</span>
      </div>

      {user && (
        <div className="nav-actions">
          <div className="user-profile">
            <div className="avatar" title={user.email}>
              {getInitials(user.name)}
            </div>
            <span className="user-name">{user.name}</span>
          </div>
          <button onClick={logout} className="btn-logout" id="logout-button">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
