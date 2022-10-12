import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuthContext();

  console.log(currentUser.uid);

  if (currentUser.uid) {
    return <Navigate to='/' />;
  }
  return children;
};

export default PrivateRoute;
