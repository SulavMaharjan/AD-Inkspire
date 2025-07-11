import { createContext, useContext, useState, useEffect } from "react";
import authService from "./authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    const role = authService.getCurrentRole();
    setCurrentUser(user);
    setCurrentRole(role);
    setLoading(false);
  }, []);

  //sign up function
  const signup = async (name, email, username, password, confirmPassword) => {
    const response = await authService.register(
      name,
      email,
      username,
      password,
      confirmPassword
    );

    if (response.isSuccess) {
      setCurrentUser(response.user);
      setCurrentRole(response.role);
      return response;
    }

    throw new Error(response.message || "Failed to sign up");
  };

  //login function
  const login = async (emailOrUsername, password, role) => {
    const response = await authService.login(emailOrUsername, password, role);

    if (response.isSuccess) {
      setCurrentUser(response.user);
      setCurrentRole(response.role);
      return response;
    }

    throw new Error(response.message || "Failed to login");
  };

  //logout function
  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCurrentRole(null);
  };

  //refresh token function
  const refreshToken = async () => {
    const success = await authService.refreshToken();
    if (!success) {
      await logout();
    }
    return success;
  };

  const value = {
    currentUser,
    currentRole,
    signup,
    login,
    logout,
    refreshToken,
    isAuthenticated: authService.isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
