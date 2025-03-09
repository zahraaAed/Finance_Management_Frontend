import React from "react";
import { Navigate } from "react-router-dom";

// PrivateRoute component
const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem("token"); // Check if the token exists in localStorage

  // If there is no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, render the requested component
  return <Component {...rest} />;
};

export default PrivateRoute;
