import React from "react";
import "../../styles/OrderDetails.css";

const ORDER_STATUS = {
  0: "Pending",
  1: "Confirmed",
  2: "Ready for Pickup",
  3: "Completed",
  4: "Cancelled",
};

const OrderDetails = ({ order, memberId, onProcess, onCancel }) => {
  const orderStatus = ORDER_STATUS[order.status] || order.status;

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <h2 className="order-details-title">Order Details</h2>
        <div className="order-status-badge" data-status={order.status}>
          {orderStatus}
        </div>
      </div>

      <div className="order-meta-section">
        <div className="order-meta-grid">
          <div className="order-meta-item">
            <span className="order-meta-label">Member ID:</span>
            <span className="order-meta-value">{memberId}</span>
          </div>
          <div className="order-meta-item">
            <span className="order-meta-label">Order ID:</span>
            <span className="order-meta-value">{order.id}</span>
          </div>
          <div className="order-meta-item">
            <span className="order-meta-label">Claim Code:</span>
            <span className="order-meta-value">{order.claimCode}</span>
          </div>
          <div className="order-meta-item">
            <span className="order-meta-label">Order Date:</span>
            <span className="order-meta-value">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="order-items-section">
        <h3 className="order-section-title">Order Items</h3>
        <div className="order-items-table-container">
          <table className="order-items-table">
            <thead className="order-items-table-header">
              <tr>
                <th className="table-header-item">Book</th>
                <th className="table-header-item">Quantity</th>
                <th className="table-header-item">Price</th>
                <th className="table-header-item">Total</th>
              </tr>
            </thead>
            <tbody className="order-items-table-body">
              {order.items.map((item) => (
                <tr key={item.id} className="order-item-row">
                  <td className="table-data-item book-title">{item.bookTitle}</td>
                  <td className="table-data-item">{item.quantity}</td>
                  <td className="table-data-item">
                    $
                    {item.discountedPrice
                      ? item.discountedPrice.toFixed(2)
                      : item.unitPrice.toFixed(2)}
                  </td>
                  <td className="table-data-item">${item.subTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="order-summary-section">
        <h3 className="order-section-title">Order Summary</h3>
        <div className="order-summary-details">
          <div className="summary-line">
            <span className="summary-label">Subtotal:</span>
            <span className="summary-value">${order.subTotal.toFixed(2)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="summary-line discount-line">
              <span className="summary-label">Discount:</span>
              <span className="summary-value">-${order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-line total-line">
            <span className="summary-label">Total:</span>
            <span className="summary-value">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="order-actions-section">
        <button onClick={onCancel} className="order-action-btn cancel-btn">
          Cancel Order
        </button>
        <button onClick={onProcess} className="order-action-btn process-btn">
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;