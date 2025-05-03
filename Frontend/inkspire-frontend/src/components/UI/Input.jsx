import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/UI.css';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  
  const toggleShowPassword = () => setShowPassword(prev => !prev);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const inputClasses = [
    'input-field',
    error ? 'input-error' : '',
    focused ? 'input-focused' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        <motion.input
          ref={ref}
          type={inputType}
          className={inputClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          {...props}
        />
        {type === 'password' && (
          <button 
            type="button" 
            className="password-toggle" 
            onClick={toggleShowPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <div className={`input-message ${error ? 'input-error-text' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;