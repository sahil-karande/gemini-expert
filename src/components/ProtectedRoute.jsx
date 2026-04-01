import React from 'react';
import { Navigate } from 'react-router-dom';
import OrganizerLogin from './OrganizerLogin';

const ProtectedRoute = ({ isAuthorized, onLogin, children }) => {
  // If not authorized, render the Login component instead of the children (Archive)
  if (!isAuthorized) {
    return <OrganizerLogin onLogin={onLogin} />;
  }

  return children;
};

export default ProtectedRoute;