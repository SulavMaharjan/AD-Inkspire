import React, { useState, useEffect } from "react";
import "../styles/PurchasedBooks.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Landing/Footer";
import {
  getUserOrders,
  getOrderById,
  cancelOrder,
} from "../context/orderService";

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
  const [imageErrors, setImageErrors] = useState({}); // Track image errors
  const pageSize = 5;

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const statusFilter = filterStatus === "All" ? null : filterStatus;

      const response = await getUserOrders(currentPage, pageSize, statusFilter);

      if (response && response.items) {
        const processedOrders = response.items.map((order) => ({
          ...order,
          //numerical status to string
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
        setSelectedOrder({
          ...orderDetails,
          //numerical status to string
          status: getStatusName(orderDetails.status),
          orderItems: orderDetails.orderItems || orderDetails.items || [],
          //total amount
          total:
            typeof orderDetails.totalAmount === "number"
              ? orderDetails.totalAmount
              : typeof orderDetails.total === "number"
              ? orderDetails.total
              : 0,
          //subtotal amount
          subTotal:
            typeof orderDetails.subTotal === "number"
              ? orderDetails.subTotal
              : 0,
          //discount amount
          discountAmount:
            typeof orderDetails.discountAmount === "number"
              ? orderDetails.discountAmount
              : 0,
        });
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

  //get item count
  const getItemCount = (order) => {
    if (!order) return 0;
    if (order.orderItems && order.orderItems.length)
      return order.orderItems.length;
    if (order.items && order.items.length) return order.items.length;
    return 0;
  };

  const getCoverImageUrl = (coverImagePath, itemId) => {
    if (imageErrors[itemId]) {
      return "/placeholder-book-cover.jpg";
    }

    if (!coverImagePath) {
      return "/placeholder-book-cover.jpg";
    }

    if (coverImagePath.startsWith("http")) {
      return coverImagePath;
    }

    if (coverImagePath.includes("https://localhost:7039")) {
      return coverImagePath;
    }

    const normalizedPath = coverImagePath.startsWith("/")
      ? coverImagePath
      : `/${coverImagePath}`;

    return `https://localhost:7039${normalizedPath}`;
  };

  const handleImageError = (itemId) => {
    console.error(`Failed to load image for item ID: ${itemId}`);
    setImageErrors((prev) => ({
      ...prev,
      [itemId]: true,
    }));
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="purchased-books-container">
          <h1 className="page-title">My Purchased Books</h1>
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
          <h1 className="page-title">My Purchased Books</h1>
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
        <h1 className="page-title">My Purchased Books</h1>

        <div className="filter-section">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

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
                        const coverImage =
                          (item.book && item.book.coverImage) ||
                          (item.book && item.book.coverImagePath) ||
                          item.coverImage ||
                          item.coverImagePath ||
                          null;

                        return (
                          <div key={itemId} className="order-item">
                            <img
                              src={getCoverImageUrl(coverImage, itemId)}
                              alt={
                                (item.book && item.book.title) ||
                                item.bookTitle ||
                                "Book cover"
                              }
                              className="book-thumbnail"
                              onError={() => handleImageError(itemId)}
                            />
                            <div className="item-details">
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

        {/* Pagination Controls */}
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

        {/* Detailed Order Modal */}
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
                    selectedOrder.orderItems.map((item, index) => {
                      const itemId =
                        item.id || `modal-${selectedOrder.id}-${index}`;
                      const coverImage =
                        (item.book && item.book.coverImage) ||
                        (item.book && item.book.coverImagePath) ||
                        item.coverImage ||
                        item.coverImagePath ||
                        null;

                      return (
                        <div key={itemId} className="modal-item">
                          <img
                            src={getCoverImageUrl(coverImage, itemId)}
                            alt={
                              (item.book && item.book.title) ||
                              item.bookTitle ||
                              "Book cover"
                            }
                            className="book-thumbnail"
                            onError={() => handleImageError(itemId)}
                          />
                          <div className="modal-item-details">
                            <div className="modal-item-title">
                              {(item.book && item.book.title) ||
                                item.bookTitle ||
                                "Unknown Book"}
                            </div>
                            <div className="modal-item-author">
                              by{" "}
                              {(item.book && item.book.author) ||
                                item.author ||
                                "Unknown Author"}
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
                      );
                    })
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
