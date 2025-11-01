import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  // Check if user is logged in
  const userString = localStorage.getItem("user");
  
  if (!userString) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Parse user data
  let user;
  try {
    user = JSON.parse(userString);
  } catch (error) {
    // Invalid user data, redirect to login
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // If role is required, check if user's role matches
  if (requiredRole) {
    if (user.role !== requiredRole) {
      // User doesn't have the required role, redirect to their own dashboard
      const roleDashboards = {
        restaurant: "/dashboard/restaurant",
        ngo: "/dashboard/ngo",
        volunteer: "/dashboard/volunteer"
      };
      
      const userDashboard = roleDashboards[user.role] || "/";
      return <Navigate to={userDashboard} replace />;
    }
  }

  // User is logged in and has correct role, render the protected component
  return children;
}

export default ProtectedRoute;

