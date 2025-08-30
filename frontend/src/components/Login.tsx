import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        border: '1px solid #000000',
        backgroundColor: '#ffffff'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '0.75rem',
          fontSize: '2rem',
          fontWeight: 'normal',
          color: '#000000',
          letterSpacing: '0.08em'
        }}>
          radar
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#000000',
          marginBottom: '1.5rem',
          lineHeight: '1.5'
        }}>
          a space for team thoughts, inspo - anything u want ...drop whats on your radar
        </p>
        
        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#f5f5f5',
            border: '1px solid #000000',
            color: '#000000'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#000000'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#000000'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '1px solid #000000',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
