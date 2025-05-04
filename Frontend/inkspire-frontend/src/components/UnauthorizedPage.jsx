import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UnauthorizedPage = () => {
  const { currentRole } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-gray-800 mb-2">
            You don't have permission to access this page with your current
            role:
            <span className="font-semibold"> {currentRole || "Unknown"}</span>
          </p>
          <p className="text-gray-700">
            Please contact an administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 text-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
