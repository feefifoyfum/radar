import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav style={{
      borderBottom: '1px solid #000000',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: '#000000',
            fontSize: '1.5rem',
            fontWeight: 'normal'
          }}
        >
          radar
        </Link>

        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#000000',
              fontSize: '1rem'
            }}
          >
            Feed
          </Link>
          
          <Link
            to={`/profile/${user.id}`}
            style={{
              textDecoration: 'none',
              color: '#000000',
              fontSize: '1rem'
            }}
          >
            Profile
          </Link>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #000000',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
