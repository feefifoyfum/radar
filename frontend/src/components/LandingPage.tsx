import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        padding: '40px',
        border: '2px solid #000000',
        backgroundColor: '#ffffff'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          fontWeight: 'bold',
          letterSpacing: '0.1em'
        }}>
          radar
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          a space for team thoughts, inspo - anything u want ...drop whats on your radar
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%'
        }}>
          <Link 
            to="/signup"
            style={{
              display: 'block',
              padding: '12px 24px',
              backgroundColor: '#000000',
              color: '#ffffff',
              textDecoration: 'none',
              border: '2px solid #000000',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            CREATE ACCOUNT
          </Link>
          
          <Link 
            to="/login"
            style={{
              display: 'block',
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              color: '#000000',
              textDecoration: 'none',
              border: '2px solid #000000',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
          >
            LOG IN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
