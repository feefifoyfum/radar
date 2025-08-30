import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import Login from './components/Login.tsx';
import Signup from './components/Signup.tsx';
import Feed from './components/Feed.tsx';
import Profile from './components/Profile.tsx';
import Navigation from './components/Navigation.tsx';
import LandingPage from './components/LandingPage.tsx';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#000000'
      }}>
        Loading...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        {user && <Navigation />}
        <Routes>
          <Route path="/" element={user ? <Navigate to="/feed" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/feed" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/feed" /> : <Signup />} />
          <Route path="/welcome" element={<LandingPage />} />
          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
