import React, { useState, useEffect } from "react";
import "../styles/PurchasedBooks.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Landing/Footer";
import {
  getUserOrders,
  getOrderById,
  cancelOrder,
} from "../context/orderService";
import { reviewService } from "../context/authService";

const getStatusName = (statusCode) => {
  const statusMap = {
    0: "Pending",
    1: "Confirmed",
    2: "Ready for Pickup",
    3: "Completed",
    4: "Cancelled",
  };
  return statusMap[statusCode] || statusCode.toString();
};

const PurchasedBooks = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewEligibility, setReviewEligibility] = useState({});
  const [reviewInputs, setReviewInputs] = useState({});
  const [bookReviews, setBookReviews] = useState({});
  const [userReviews, setUserReviews] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  const pageSize = 5;

  useEffect(() => {
    fetchOrders();
    loadUserReviews();
  }, [filterStatus, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const statusFilter = filterStatus === "All" ? null : filterStatus;

      const response = await getUserOrders(currentPage, pageSize, statusFilter);

      if (response && response.items) {
        const processedOrders = response.items.map((order) => ({
          ...order,
          status: getStatusName(order.status),
          orderItems: order.orderItems || order.items || [],
          total:
            typeof order.totalAmount === "number"
              ? order.totalAmount
              : typeof order.total === "number"
              ? order.total
              : 0,
        }));

        setPurchases(processedOrders);
        setTotalPages(response.totalPages || 1);
      } else {
        console.error("Invalid response format:", response);
        setError("Received invalid data from server. Please try again.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders. Please try again later.");
      setLoading(false);
    }
  };

  const loadUserReviews = async () => {
    try {
      const reviews = await reviewService.getUserReviews();
      setUserReviews(reviews);
    } catch (error) {
      console.error("Error loading user reviews:", error);
    }
  };

  const checkReviewEligibility = async (order) => {
    const eligibility = {};
    const reviews = {};

    for (const item of order.orderItems) {
      try {
        const canReview = await reviewService.checkReviewEligibility(
          item.bookId
        );
        eligibility[item.bookId] = canReview;

        const bookReviews = await reviewService.getBookReviews(item.bookId);
        reviews[item.bookId] = bookReviews;
      } catch (error) {
        console.error("Error checking review eligibility:", error);
        eligibility[item.bookId] = false;
        reviews[item.bookId] = [];
      }
    }

    setReviewEligibility(eligibility);
    setBookReviews(reviews);
  };

  const handleReviewChange = (bookId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        [field]: value,
      },
    }));
  };

  const submitReview = async (bookId) => {
    try {
      const review = reviewInputs[bookId];
      if (!review || !review.rating) {
        alert("Please provide a rating");
        return;
      }

      await reviewService.createReview(
        bookId,
        review.rating,
        review.comment || ""
      );

      const updatedReviews = await reviewService.getBookReviews(bookId);
      setBookReviews((prev) => ({
        ...prev,
        [bookId]: updatedReviews,
      }));

      setReviewEligibility((prev) => ({
        ...prev,
        [bookId]: false,
      }));

      setReviewInputs((prev) => {
        const newInputs = { ...prev };
        delete newInputs[bookId];
        return newInputs;
      });

      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleViewDetails = async (orderId) => {
    try {
      const orderDetails = await getOrderById(orderId);
      if (orderDetails) {
        const processedOrder = {
          ...orderDetails,
          status: getStatusName(orderDetails.status),
          orderItems: orderDetails.orderItems || orderDetails.items || [],
          total:
            typeof orderDetails.totalAmount === "number"
              ? orderDetails.totalAmount
              : typeof orderDetails.total === "number"
              ? orderDetails.total
              : 0,
          subTotal:
            typeof orderDetails.subTotal === "number"
              ? orderDetails.subTotal
              : 0,
          discountAmount:
            typeof orderDetails.discountAmount === "number"
              ? orderDetails.discountAmount
              : 0,
        };

        setSelectedOrder(processedOrder);

        if (processedOrder.status === "Completed") {
          await checkReviewEligibility(processedOrder);
        }
      }
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      alert("Could not load order details. Please try again.");
    }
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (confirmed) {
      try {
        await cancelOrder(orderId);

        setPurchases(
          purchases.map((order) =>
            order.id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: "Cancelled" });
        }

        alert("Order successfully cancelled");
      } catch (err) {
        console.error("Failed to cancel order:", err);
        alert(`Failed to cancel order: ${err.message}`);
      }
    }
  };

  const filteredPurchases =
    filterStatus === "All"
      ? purchases
      : purchases.filter((order) => order.status === filterStatus);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
      case "Picked Up":
        return "status-completed";
      case "Ready for Pickup":
      case "Processing":
      case "Confirmed":
        return "status-ready";
      case "Cancelled":
        return "status-cancelled";
      case "Pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getItemCount = (order) => {
    if (!order) return 0;
    if (order.orderItems && order.orderItems.length)
      return order.orderItems.length;
    if (order.items && order.items.length) return order.items.length;
    return 0;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="purchased-books-container">
          <h1 className="page-title">My Orders</h1>
          <div className="loading">Loading your orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="purchased-books-container">
          <h1 className="page-title">My Orders</h1>
          <div className="error-message">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="purchased-books-container">
        <h1 className="page-title">My Orders</h1>

        <div className="orders-list">
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-date">
                      Placed on {formatDate(order.createdAt || order.orderDate)}
                    </div>
                  </div>
                  <div className="order-status-section">
                    <span
                      className={`order-status ${getStatusClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="order-info">
                    <div className="info-item">
                      <span className="label">Items:</span>
                      <span className="value">{getItemCount(order)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Total:</span>
                      <span className="value">
                        $
                        {order.total
                          ? order.total.toFixed(2)
                          : order.totalAmount
                          ? order.totalAmount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="info-item">
                        <span className="label">Discount:</span>
                        <span className="value savings">
                          ${order.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="info-item">
                      <span className="label">Claim Code:</span>
                      <span className="value code">{order.claimCode}</span>
                    </div>
                  </div>

                  <button
                    className="toggle-details"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    {expandedOrders[order.id] ? "Hide Items" : "Show Items"}
                  </button>
                </div>

                {expandedOrders[order.id] && (
                  <div className="order-items">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item, index) => {
                        const itemId = item.id || `${order.id}-${index}`;

                        return (
                          <div key={itemId} className="order-item">
                            <div className="item-detaills">
                              <div className="item-title">
                                {(item.book && item.book.title) ||
                                  item.bookTitle ||
                                  "Unknown Book"}
                              </div>
                              <div className="item-author">
                                by{" "}
                                {(item.book && item.book.author) ||
                                  item.author ||
                                  "Unknown Author"}
                              </div>
                              <div className="item-price">
                                $
                                {(item.price || item.unitPrice || 0).toFixed(2)}{" "}
                                x {item.quantity || 1}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No items found in this order.</p>
                    )}
                  </div>
                )}

                <div className="order-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    View Full Details
                  </button>

                  {(order.status === "Ready for Pickup" ||
                    order.status === "Confirmed" ||
                    order.status === "Pending") && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <p>
                No orders matching your filter. Try changing the filter or make
                a purchase!
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1
                  ? "pagination-button disabled"
                  : "pagination-button"
              }
            >
              Previous
            </button>

            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pagination-button disabled"
                  : "pagination-button"
              }
            >
              Next
            </button>
          </div>
        )}

        {selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-modal" onClick={handleCloseDetails}>
                &times;
              </button>

              <h2>Order #{selectedOrder.id} Details</h2>

              <div className="modal-section">
                <h3>Order Information</h3>
                <div className="details-grid">
                  <div className="detail-row">
                    <span className="detail-label">Order Date:</span>
                    <span className="detail-value">
                      {formatDate(
                        selectedOrder.createdAt || selectedOrder.orderDate
                      )}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`detail-value ${getStatusClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Claim Code:</span>
                    <span className="detail-value code">
                      {selectedOrder.claimCode}
                    </span>
                  </div>
                  {selectedOrder.pickupDate && (
                    <div className="detail-row">
                      <span className="detail-label">Picked Up:</span>
                      <span className="detail-value">
                        {formatDate(selectedOrder.pickupDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h3>Items ({getItemCount(selectedOrder)})</h3>
                <div className="modal-items">
                  {selectedOrder.orderItems &&
                  selectedOrder.orderItems.length > 0 ? (
                    selectedOrder.orderItems.map((item, index) => (
                      <React.Fragment key={item.id || index}>
                        <div className="modal-item">
                          <div className="modal-item-details">
                            <div className="modal-item-title">
                              {item.book && item.book.title
                                ? item.book.title
                                : item.bookTitle || "Unknown Book"}
                            </div>
                            <div className="modal-item-author">
                              by{" "}
                              {item.book && item.book.author
                                ? item.book.author
                                : item.author || "Unknown Author"}
                            </div>
                            <div className="modal-item-quantity">
                              Quantity: {item.quantity || 1}
                            </div>
                            <div className="modal-item-price">
                              ${(item.price || item.unitPrice || 0).toFixed(2)}{" "}
                              each
                            </div>
                            <div className="modal-item-subtotal">
                              Subtotal: $
                              {(
                                (item.price || item.unitPrice || 0) *
                                (item.quantity || 1)
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Review Section */}
                        {selectedOrder.status === "Completed" && (
                          <div className="review-section">
                            {/* Existing reviews for the book */}
                            {bookReviews[item.bookId]?.length > 0 && (
                              <div className="existing-reviews">
                                <h4>Reviews for this book:</h4>
                                {bookReviews[item.bookId].map((review, idx) => (
                                  <div key={idx} className="review-item">
                                    <div className="review-rating">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                          key={i}
                                          className={
                                            i < review.rating
                                              ? "star-filled"
                                              : "star-empty"
                                          }
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                    <p className="review-comment">
                                      {review.comment}
                                    </p>
                                    <div className="review-meta">
                                      By {review.userName} on{" "}
                                      {new Date(
                                        review.createdDate
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Review form if eligible */}
                            {reviewEligibility[item.bookId] && (
                              <div className="review-form">
                                <h4>Leave a Review</h4>
                                <div className="rating-input">
                                  <label>Rating:</label>
                                  <select
                                    value={
                                      reviewInputs[item.bookId]?.rating || ""
                                    }
                                    onChange={(e) =>
                                      handleReviewChange(
                                        item.bookId,
                                        "rating",
                                        parseInt(e.target.value)
                                      )
                                    }
                                  >
                                    <option value="">Select rating</option>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <option key={num} value={num}>
                                        {num} star{num !== 1 ? "s" : ""}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="comment-input">
                                  <label>Comment (optional):</label>
                                  <textarea
                                    value={
                                      reviewInputs[item.bookId]?.comment || ""
                                    }
                                    onChange={(e) =>
                                      handleReviewChange(
                                        item.bookId,
                                        "comment",
                                        e.target.value
                                      )
                                    }
                                    rows="3"
                                  />
                                </div>
                                <button
                                  className="submit-review-btn"
                                  onClick={() => submitReview(item.bookId)}
                                >
                                  Submit Review
                                </button>
                              </div>
                            )}

                            {/* Message if already reviewed */}
                            {!reviewEligibility[item.bookId] &&
                              userReviews.some(
                                (r) => r.bookId === item.bookId
                              ) && (
                                <div className="already-reviewed">
                                  <p>You've already reviewed this book.</p>
                                </div>
                              )}
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <p>No items found in this order.</p>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h3>Order Summary</h3>
                <div className="summary-calculations">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>
                      $
                      {selectedOrder.subTotal !== undefined
                        ? selectedOrder.subTotal.toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount:</span>
                      <span>-${selectedOrder.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>
                      $
                      {selectedOrder.total !== undefined
                        ? selectedOrder.total.toFixed(2)
                        : selectedOrder.totalAmount !== undefined
                        ? selectedOrder.totalAmount.toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                {(selectedOrder.status === "Ready for Pickup" ||
                  selectedOrder.status === "Confirmed" ||
                  selectedOrder.status === "Pending") && (
                  <button
                    className="modal-cancel-btn"
                    onClick={() => {
                      handleCancelOrder(selectedOrder.id);
                      handleCloseDetails();
                    }}
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  className="view-details-btn"
                  onClick={handleCloseDetails}
                >
                  Close
                </button>
                <div className="pickup-instructions">
                  <h4>In-Store Pickup Instructions</h4>
                  <p>
                    Present your membership ID and the claim code at our store
                    to pick up your order.
                  </p>
                  <p>
                    Our store hours: Monday-Friday 9AM-8PM, Saturday-Sunday
                    10AM-6PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PurchasedBooks;
