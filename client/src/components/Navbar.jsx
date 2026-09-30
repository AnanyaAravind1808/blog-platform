import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-brand"
          onClick={() => setMenuOpen(false)}
        >
          BlogPlatform
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                onClick={() => setMenuOpen(false)}
              >
                Create Post
              </Link>

              <Link
                to="/my-posts"
                onClick={() => setMenuOpen(false)}
              >
                My Posts
              </Link>

              <Link
                to="/my-profile"
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              {user?.role === 'admin' && (
  <Link
    to="/admin"
    onClick={() => setMenuOpen(false)}
  >
    Admin Dashboard
  </Link>
)}

              <span className="navbar-user">
                Hi, {user?.name}
              </span>

              <button
                type="button"
                className="btn btn-small"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}