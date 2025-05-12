import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Landing/Footer";
import "../styles/CartPage.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:7039/api";

const CartPage = () => {
  const {
    cart,
    cartItems,
    totalItems,
    totalAmount,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
  } = useContext(CartContext);

  const { isAuthenticated } = useAuth();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [useDiscount, setUseDiscount] = useState(false);
  const [discountEligible, setDiscountEligible] = useState(false);
  const navigate = useNavigate();

  //calculate total items
  const actualTotalItems = cartItems
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  useEffect(() => {
    console.log("Cart Debug Info:");
    console.log("cartItems:", cartItems);
    console.log("totalItems from context:", totalItems);
    console.log("actualTotalItems calculated:", actualTotalItems);
    console.log("totalAmount:", totalAmount);
  }, [cartItems, totalItems, actualTotalItems, totalAmount]);

  //bulk discount amount correctly
  const calculateBulkDiscount = () => {
    const discount = actualTotalItems >= 5 ? totalAmount * 0.05 : 0;
    return discount;
  };

  //member discount amount
  const calculateMemberDiscount = () => {
    const discount = useDiscount && discountEligible ? totalAmount * 0.1 : 0;
    return discount;
  };

  //actual total
  const calculateFinalTotal = () => {
    const bulkDiscount = calculateBulkDiscount();
    const memberDiscount = calculateMemberDiscount();
    return totalAmount - bulkDiscount - memberDiscount;
  };

  useEffect(() => {
    const checkDiscountEligibility = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/orders/check-discount`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const eligible = await response.json();
          setDiscountEligible(eligible);
        }
      } catch (error) {
        console.error("Error checking discount eligibility:", error);
      }
    };

    if (isAuthenticated) {
      checkDiscountEligibility();
    }
  }, [isAuthenticated]);

  //initial cart fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart(true);
    }
  }, [isAuthenticated, fetchCart]);

  const handlePlaceOrder = () => {
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    setOrderProcessing(true);
    setOrderError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          useAvailableDiscount: useDiscount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Error creating order: ${response.statusText}`
        );
      }

      const orderData = await response.json();
      setOrderSuccess(true);
      fetchCart(true);

    } catch (error) {
      console.error("Error creating order:", error);
      setOrderError(error.message);
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setOrderError(null);
  };

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleRemoveItem = (cartItemId) => {
    removeItem(cartItemId);
  };

  if (isAuthenticated === null) {
    return (
      <div>
        <Navbar />
        <div className="cart-page">
          <div className="cart-container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <Navbar />
        <div className="cart-page">
          <div className="cart-container">
            <div className="empty-cart">
              <h2>Please log in to view your cart</h2>
              <p>You need to be logged in to access your shopping cart.</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="cart-page">
          <div className="cart-container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your cart...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="cart-page">
          <div className="cart-container">
            <div className="error-state">
              <h2>Error Loading Cart</h2>
              <p>{error}</p>
              <button className="btn-primary" onClick={() => fetchCart(true)}>
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isCartEmpty = !cartItems || cartItems.length === 0;

  if (isCartEmpty) {
    return (
      <div>
        <Navbar />
        <div className="cart-page">
          <div className="cart-container">
            <div className="empty-cart">
              <h2>Your Cart is Empty</h2>
              <p>Looks like you haven't added any books to your cart yet.</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/books")}
              >
                Browse Books
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  //discounts for display
  const bulkDiscountAmount = calculateBulkDiscount();
  const memberDiscountAmount = calculateMemberDiscount();
  const finalTotal = calculateFinalTotal();

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1>Your Shopping Cart</h1>
            <p>
              {actualTotalItems} {actualTotalItems === 1 ? "item" : "items"} in
              your cart
            </p>
            <div style={{ fontSize: "12px", color: "#666" }}>
              <p>
                Debug: Total Items: {actualTotalItems}, Discount Eligible:{" "}
                {actualTotalItems >= 5 ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => {
                const isDiscounted =
                  item.book?.isOnSale &&
                  item.book?.discountPercentage &&
                  item.book?.discountStartDate &&
                  item.book?.discountEndDate &&
                  new Date() >= new Date(item.book.discountStartDate) &&
                  new Date() <= new Date(item.book.discountEndDate);

                const bookPrice = item.price || item.book?.price || 0;
                const bookTitle =
                  item.bookTitle || item.book?.title || "Unknown Book";
                const bookAuthor =
                  item.author || item.book?.author || "Unknown Author";
                const discountPercentage = item.book?.discountPercentage || 0;

                const currentPrice = isDiscounted
                  ? bookPrice - (bookPrice * discountPercentage) / 100
                  : bookPrice;

                return (
                  <div className="cart-item" key={item.id}>
                    <div className="item-details">
                      <div className="item-info">
                        <h3>{bookTitle}</h3>
                        <p className="item-author">by {bookAuthor}</p>

                        <div className="pricing">
                          {isDiscounted ? (
                            <>
                              <span className="original-price">
                                ${bookPrice.toFixed(2)}
                              </span>
                              <span className="discounted-price">
                                ${currentPrice.toFixed(2)}
                              </span>
                              <span className="discount-tag">
                                {discountPercentage}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="price">
                              ${bookPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="item-actions">
                        <div className="quantity-control">
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        <div className="item-total">
                          <span>
                            ${(currentPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              {actualTotalItems >= 5 && (
                <div className="summary-row discount">
                  <span>Bulk Discount (5%):</span>
                  <span>-${bulkDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              {discountEligible && (
                <div className="discount-option">
                  <label className="discount-checkbox">
                    <input
                      type="checkbox"
                      checked={useDiscount}
                      onChange={() => setUseDiscount(!useDiscount)}
                    />
                    Use my 10% discount
                  </label>
                  <p className="discount-note">
                    You've earned a 10% discount on your order!
                  </p>
                </div>
              )}

              {useDiscount && discountEligible && (
                <div className="summary-row discount">
                  <span>Member Discount (10%):</span>
                  <span>-${memberDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <button className="place-order-btn" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>

        {showConfirmation && (
          <div className="modal-overlay">
            <div className="order-confirmation-modal">
              <div className="modal-header">
                <h2>Confirm Your Order</h2>
              </div>

              <div className="modal-body">
                <h3>Order Details</h3>
                <div className="order-items-summary">
                  {cartItems.map((item) => {
                    const isDiscounted =
                      item.book?.isOnSale &&
                      item.book?.discountPercentage &&
                      item.book?.discountStartDate &&
                      item.book?.discountEndDate &&
                      new Date() >= new Date(item.book.discountStartDate) &&
                      new Date() <= new Date(item.book.discountEndDate);

                    const bookPrice = item.price || item.book?.price || 0;
                    const bookTitle =
                      item.bookTitle || item.book?.title || "Unknown Book";
                    const discountPercentage =
                      item.book?.discountPercentage || 0;

                    const currentPrice = isDiscounted
                      ? bookPrice - (bookPrice * discountPercentage) / 100
                      : bookPrice;

                    return (
                      <div className="confirmation-item" key={item.id}>
                        <div className="item-name">
                          <span>{bookTitle}</span>
                          <span>× {item.quantity}</span>
                        </div>
                        <div className="item-price">
                          ${(currentPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>

                  {actualTotalItems >= 5 && (
                    <div className="summary-row discount">
                      <span>Bulk Discount (5%):</span>
                      <span>-${bulkDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {useDiscount && discountEligible && (
                    <div className="summary-row discount">
                      <span>Member Discount (10%):</span>
                      <span>-${memberDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {orderError && (
                  <div className="order-error">
                    <p>{orderError}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={handleCancelConfirmation}
                  disabled={orderProcessing}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleConfirmOrder}
                  disabled={orderProcessing || orderSuccess}
                >
                  {orderProcessing
                    ? "Processing..."
                    : orderSuccess
                    ? "Order Placed!"
                    : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
