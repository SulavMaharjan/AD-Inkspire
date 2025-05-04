import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentRole } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (currentRole?.toLowerCase() !== "superadmin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export const MemberProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentRole } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (currentRole?.toLowerCase() !== "member") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};


export const StaffProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentRole } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (currentRole?.toLowerCase() !== "staff") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
