import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './src/components/RegistrationForm';
import ProtectedRoute from './src/components/ProtectedRoute';
import OrganizerArchive from './src/components/OrganizerArchive';
import OrganizerLogin from './src/components/OrganizerLogin';
import { Toaster } from 'react-hot-toast';

function App() {
  // 1. Initialize state from LocalStorage so it survives a refresh
  const [isAuthorized, setIsAuthorized] = useState(() => {
    const savedAuth = localStorage.getItem('isOrganizerAuthorized');
    return savedAuth === 'true';
  });

  // 2. Function to call when login is successful
  const handleLoginSuccess = () => {
    setIsAuthorized(true);
    localStorage.setItem('isOrganizerAuthorized', 'true');
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<RegistrationForm />} />

        {/* Login Route - Pass the new handler */}
        <Route 
          path="/admin-login" 
          element={<OrganizerLogin onLogin={handleLoginSuccess} />} 
        />

        {/* Protected Route */}
        <Route 
          path="/admin/archive" 
          element={
            <ProtectedRoute isAuthorized={isAuthorized}>
              <OrganizerArchive />
            </ProtectedRoute>
          } 
        />

        {/* Redirects */}
        <Route path="/organizer" element={<Navigate to="/admin/archive" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;