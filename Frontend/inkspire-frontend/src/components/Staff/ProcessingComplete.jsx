import React from 'react';
import { CheckCircle, Printer, ArrowRight } from 'lucide-react';
import '../../styles/ProcessingComplete.css';

const ProcessingComplete = ({ order, onProcessAnother }) => {
  const handlePrintReceipt = () => {
    // In a real app, this would trigger receipt printing
    window.alert('Printing receipt...');
  };

  return (
    <div className="processing-complete">
      <div className="success-animation">
        <CheckCircle size={64} />
      </div>
      
      <div className="completion-message">
        <h2>Order Successfully Processed</h2>
        <p>Order {order.id} has been fulfilled and is ready for pickup</p>
      </div>
      
      <div className="completion-details">
        <div className="detail-item">
          <span className="detail-label">Date & Time:</span>
          <span className="detail-value">{new Date(order.processedAt).toLocaleString()}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Processed By:</span>
          <span className="detail-value">{order.processedBy}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Customer:</span>
          <span className="detail-value">{order.member.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Total Amount:</span>
          <span className="detail-value">${order.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="completion-actions">
        <button className="print-receipt" onClick={handlePrintReceipt}>
          <Printer size={18} />
          <span>Print Receipt</span>
        </button>
        
        <button className="process-another" onClick={onProcessAnother}>
          <span>Process Another Order</span>
          <ArrowRight size={18} />
        </button>
      </div>
      
      <div className="completion-note">
        <p>Please remind the customer that they can leave a review for their purchased books through their account.</p>
      </div>
    </div>
  );
};

export default ProcessingComplete;