import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const user = localStorage.getItem('inkspireUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate a successful login
    const user = {
      id: '123456',
      email,
      role,
      name: email.split('@')[0],
    };
    
    setCurrentUser(user);
    localStorage.setItem('inkspireUser', JSON.stringify(user));
    return Promise.resolve(user);
  };

  const signup = (name, email, password, role) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate a successful signup
    const user = {
      id: '123456',
      email,
      role,
      name,
    };
    
    setCurrentUser(user);
    localStorage.setItem('inkspireUser', JSON.stringify(user));
    return Promise.resolve(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('inkspireUser');
    return Promise.resolve();
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
    role: currentUser?.role,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};