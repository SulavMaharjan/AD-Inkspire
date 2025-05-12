import React from "react";
import "../../styles/ProcessingComplete.css";

const ProcessingComplete = ({ order, memberId, onProcessAnother }) => {
  return (
    <div className="processing-complete">
      <div className="success-animation">✓</div>

      <div className="completion-message">
        <h2>Order Processed Successfully</h2>
        <p>Thank you for your purchase!</p>
      </div>

      <div className="completion-details">
        <div className="detail-item">
          <span className="detail-label">Member ID:</span>
          <span className="detail-value">{memberId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Order ID:</span>
          <span className="detail-value">{order.id}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Processed at:</span>
          <span className="detail-value">{new Date().toLocaleString()}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Total Amount:</span>
          <span className="detail-value">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="completion-actions">
        <button className="process-another" onClick={onProcessAnother}>
          Process Another Order
        </button>
      </div>

      <div className="completion-note">
        <p>A receipt has been emailed to the member. Thank you!</p>
      </div>
    </div>
  );
};

export default ProcessingComplete;
