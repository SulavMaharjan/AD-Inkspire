import React, { useState, useEffect } from "react";
import "../styles/PurchasedBooks.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Landing/Footer";

const PurchasedBooks = () => {
  // Sample data for purchased books - would come from API in real app
  const [purchases, setPurchases] = useState([
    {
      id: 101,
      orderDate: "2025-04-01",
      claimCode: "BCK789456",
      orderStatus: "Picked Up",
      pickupDate: "2025-04-03",
      total: 67.95,
      discount: 3.58,
      items: [
        {
          id: 1,
          title: "The Midnight Library",
          author: "Matt Haig",
          coverImage: "/api/placeholder/120/180",
          price: 24.99,
          quantity: 1,
        },
        {
          id: 2,
          title: "Project Hail Mary",
          author: "Andy Weir",
          coverImage: "/api/placeholder/120/180",
          price: 22.99,
          quantity: 1,
        },
      ],
    },
    {
      id: 102,
      orderDate: "2025-03-15",
      claimCode: "BCK543210",
      orderStatus: "Ready for Pickup",
      pickupDate: null,
      total: 45.98,
      discount: 0,
      items: [
        {
          id: 3,
          title: "Dune",
          author: "Frank Herbert",
          coverImage: "/api/placeholder/120/180",
          price: 19.99,
          quantity: 1,
        },
        {
          id: 4,
          title: "The Way of Kings",
          author: "Brandon Sanderson",
          coverImage: "/api/placeholder/120/180",
          price: 25.99,
          quantity: 1,
        },
      ],
    },
    {
      id: 103,
      orderDate: "2025-02-23",
      claimCode: "BCK123789",
      orderStatus: "Cancelled",
      pickupDate: null,
      total: 18.99,
      discount: 0,
      items: [
        {
          id: 5,
          title: "Klara and the Sun",
          author: "Kazuo Ishiguro",
          coverImage: "/api/placeholder/120/180",
          price: 18.99,
          quantity: 1,
        },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [filterStatus, setFilterStatus] = useState("All");

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleCancelOrder = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (confirmed) {
      setPurchases(
        purchases.map((order) =>
          order.id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );

      // If the cancelled order is currently selected in the modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: "Cancelled" });
      }

      alert("Order successfully cancelled");
    }
  };

  const filteredPurchases =
    filterStatus === "All"
      ? purchases
      : purchases.filter((order) => order.orderStatus === filterStatus);

  const getStatusClass = (status) => {
    switch (status) {
      case "Picked Up":
        return "status-completed";
      case "Ready for Pickup":
        return "status-ready";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

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
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Orders</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Picked Up">Picked Up</option>
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
                      Placed on {order.orderDate}
                    </div>
                  </div>
                  <div className="order-status-section">
                    <span
                      className={`order-status ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="order-info">
                    <div className="info-item">
                      <span className="label">Items:</span>
                      <span className="value">{order.items.length}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Total:</span>
                      <span className="value">${order.total.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="info-item">
                        <span className="label">Discount:</span>
                        <span className="value savings">
                          ${order.discount.toFixed(2)}
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
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="book-thumbnail"
                        />
                        <div className="item-details">
                          <div className="item-title">{item.title}</div>
                          <div className="item-author">by {item.author}</div>
                          <div className="item-price">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="order-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Full Details
                  </button>

                  {order.orderStatus === "Ready for Pickup" && (
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
                      {selectedOrder.orderDate}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`detail-value ${getStatusClass(
                        selectedOrder.orderStatus
                      )}`}
                    >
                      {selectedOrder.orderStatus}
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
                        {selectedOrder.pickupDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h3>Items ({selectedOrder.items.length})</h3>
                <div className="modal-items">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="modal-item">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="modal-book-image"
                      />
                      <div className="modal-item-details">
                        <div className="modal-item-title">{item.title}</div>
                        <div className="modal-item-author">
                          by {item.author}
                        </div>
                        <div className="modal-item-quantity">
                          Quantity: {item.quantity}
                        </div>
                        <div className="modal-item-price">
                          ${item.price.toFixed(2)} each
                        </div>
                        <div className="modal-item-subtotal">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h3>Order Summary</h3>
                <div className="summary-calculations">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>
                      $
                      {(selectedOrder.total + selectedOrder.discount).toFixed(
                        2
                      )}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount:</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                {selectedOrder.orderStatus === "Ready for Pickup" && (
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
