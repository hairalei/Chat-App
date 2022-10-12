import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuthContext();

  if (currentUser.uid) {
    return <Navigate to='/' />;
  }
  return children;
};

export default PrivateRoute;
