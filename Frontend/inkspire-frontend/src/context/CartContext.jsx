import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getCart } from './cartService';

// Create the context

export const CartContext = createContext({
  cart: null,
  cartItems: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  fetchCart: () => {},
  addToCart: () => {},
  isAuthenticated: false,
  toast: null,
  showToast: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      if (token) {
        fetchCart();
      } else {
        setCart(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
      
      // If unauthorized, clear cart
      if (err.message === 'Authentication required') {
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Derived values
  const cartItems = cart?.items || [];
  const totalItems = cart?.totalItems || 0;
  const totalAmount = cart?.totalAmount || 0;

  const value = {
    cart,
    cartItems,
    totalItems,
    totalAmount,
    loading,
    error,
    fetchCart,
    isAuthenticated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};