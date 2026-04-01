import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './src/components/RegistrationForm';
import ProtectedRoute from './src/components/ProtectedRoute';
import OrganizerArchive from './src/components/OrganizerArchive';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route 
          path="/organizer" 
          element={
            <ProtectedRoute 
              isAuthorized={isAuthorized} 
              onLogin={() => setIsAuthorized(true)}
            >
              <OrganizerArchive />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;