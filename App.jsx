import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from "./src/components/RegistrationForm";
import ProtectedRoute from "./src/components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';

// Placeholder for the Gallery you'll build in Phase 3
const OrganizerArchive = () => (
  <div className="p-20 text-white">
    <h1 className="text-4xl font-bold text-purple-500">Organizer Archive</h1>
    <p className="mt-4 text-gray-400">Submissions will appear here in Phase 3...</p>
  </div>
);

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Route: Participant Submission */}
        <Route path="/" element={<RegistrationForm />} />

        {/* Protected Route: Organizer View */}
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

        {/* Redirect any unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;