import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './src/components/RegistrationForm';
import ProtectedRoute from './src/components/ProtectedRoute';
import OrganizerArchive from './src/components/OrganizerArchive';
import OrganizerLogin from './src/components/OrganizerLogin'; // Import your new login UI
import { Toaster } from 'react-hot-toast';

function App() {
  // This state controls if the organizer has entered the correct "Access Key"
  const [isAuthorized, setIsAuthorized] = useState(false);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Route: For Students to register and upload images */}
        <Route path="/" element={<RegistrationForm />} />

        {/* The Gatekeeper: Your new Cyberpunk Login UI */}
        <Route 
          path="/admin-login" 
          element={<OrganizerLogin onLogin={() => setIsAuthorized(true)} />} 
        />

        {/* The Secure Room: Only accessible if isAuthorized is true */}
        <Route 
          path="/admin/archive" 
          element={
            <ProtectedRoute isAuthorized={isAuthorized}>
              <OrganizerArchive />
            </ProtectedRoute>
          } 
        />

        {/* Redirect for any old /organizer links or typos */}
        <Route path="/organizer" element={<Navigate to="/admin/archive" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;