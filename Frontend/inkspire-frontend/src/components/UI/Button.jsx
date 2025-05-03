import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import '../../styles/UI.css';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  ...props
}, ref) => {
  
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    icon ? 'button-with-icon' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <motion.button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;