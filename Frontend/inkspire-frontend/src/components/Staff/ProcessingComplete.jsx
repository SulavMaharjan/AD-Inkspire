import React from "react";
import "../../styles/ProcessingComplete.css";

const ProcessingComplete = ({ order, memberId, onProcessAnother }) => {
  return (
    <div className="pc-container">
      <div className="pc-success-icon">✓</div>

      <div className="pc-message">
        <h2 className="pc-title">Order Processed Successfully</h2>
        <p className="pc-subtitle">Thank you for your purchase!</p>
      </div>

      <div className="pc-details-card">
        <div className="pc-detail-row">
          <span className="pc-detail-label">Member ID:</span>
          <span className="pc-detail-value">{memberId}</span>
        </div>
        <div className="pc-detail-row">
          <span className="pc-detail-label">Order ID:</span>
          <span className="pc-detail-value">{order.id}</span>
        </div>
        <div className="pc-detail-row">
          <span className="pc-detail-label">Processed at:</span>
          <span className="pc-detail-value">{new Date().toLocaleString()}</span>
        </div>
        <div className="pc-detail-row">
          <span className="pc-detail-label">Total Amount:</span>
          <span className="pc-detail-value">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="pc-actions">
        <button className="pc-primary-btn" onClick={onProcessAnother}>
          Process Another Order
        </button>
      </div>

      <div className="pc-footer-note">
        <p>A receipt has been emailed to the member. Thank you!</p>
      </div>
    </div>
  );
};

export default ProcessingComplete;