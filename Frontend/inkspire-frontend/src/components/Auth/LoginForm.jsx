import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../UI/Button';
import Input from '../UI/Input';
import RoleSelection from './RoleSelection';
import '../../styles/Auth.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!showRoleSelection) {
      setShowRoleSelection(true);
      return;
    }
    
    if (!role) {
      setError('Please select a role');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };
  
  return (
    <motion.div 
      className="auth-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your Inkspire account</p>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        {!showRoleSelection ? (
          <>
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="auth-actions">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Continue'}
              </Button>
            </div>
            <div className="auth-links">
              <a href="/signup">Don't have an account? Sign up</a>
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </>
        ) : (
          <RoleSelection 
            selectedRole={role} 
            onSelect={handleRoleSelect}
            onBack={() => setShowRoleSelection(false)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </form>
    </motion.div>
  );
};

export default LoginForm;