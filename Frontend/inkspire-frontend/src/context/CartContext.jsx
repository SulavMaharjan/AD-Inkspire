import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeFromCart,
} from "./cartService";
import { useAuth } from "./AuthContext";

export const CartContext = createContext({
  cart: null,
  cartItems: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  fetchCart: () => {},
  addToCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  toast: null,
  showToast: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const lastFetchTimeRef = useRef(0);

  const { isAuthenticated } = useAuth();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  //fetch cart data
  const fetchCart = useCallback(
    async (forceRefresh = false) => {
      if (!isAuthenticated) {
        return;
      }

      const now = Date.now();
      if (!forceRefresh && now - lastFetchTimeRef.current < 2000) {
        return;
      }

      setLoading(true);
      setError(null);
      lastFetchTimeRef.current = now;

      try {
        const cartData = await getCart();

        if (cartData && typeof cartData === "object") {
          setCart(cartData);
        } else {
          setError("Invalid cart data received from server");
          setCart(null);
        }
      } catch (err) {
        setError(err.message);

        if (err.message === "Authentication required") {
          setCart(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  //add to cart
  const addToCart = async (bookId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast("Please log in to add items to cart", "error");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiAddToCart(bookId, quantity);
      showToast("Item added to cart successfully", "success");
      await fetchCart(true);
      return result;
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  //update item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      await updateCartItem(cartItemId, quantity);
      await fetchCart(true);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  //remove item
  const removeItem = async (cartItemId) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      await removeFromCart(cartItemId);
      showToast("Item removed from cart", "success");
      await fetchCart(true);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  //fetch cart
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart(true);
    } else {
      setCart(null);
    }
  }, [isAuthenticated, fetchCart]);

  const cartItems = cart?.items || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart?.totalAmount || 0;

  const value = {
    cart,
    cartItems,
    totalItems,
    totalAmount,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    toast,
    showToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
