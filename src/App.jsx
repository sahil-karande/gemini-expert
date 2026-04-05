import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from "./components/RegistrationForm";
import ProtectedRoute from "./components/ProtectedRoute";
import OrganizerArchive from "./components/OrganizerArchive";
import OrganizerLogin from "./components/OrganizerLogin";
import { Toaster } from 'react-hot-toast';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    const savedAuth = localStorage.getItem('isOrganizerAuthorized');
    return savedAuth === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuthorized(true);
    localStorage.setItem('isOrganizerAuthorized', 'true');
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<RegistrationForm />} />

        <Route 
          path="/admin-login" 
          element={<OrganizerLogin onLogin={handleLoginSuccess} />} 
        />

        {/* Updated Route: Accepts :round as a parameter (e.g., /admin/archive/1) */}
        <Route 
          path="/admin/archive/:round" 
          element={
            <ProtectedRoute isAuthorized={isAuthorized}>
              <OrganizerArchive />
            </ProtectedRoute>
          } 
        />

        {/* Redirects */}
        {/* If user goes to the base archive link, send them to Round 1 by default */}
        <Route path="/admin/archive" element={<Navigate to="/admin/archive/1" replace />} />
        <Route path="/organizer" element={<Navigate to="/admin/archive/1" replace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;