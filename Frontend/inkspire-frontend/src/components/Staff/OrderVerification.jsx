import React, { useState } from "react";
import "../../styles/OrderVerification.css";

const OrderVerification = ({ onVerify, memberId, onMemberIdChange, isLoading }) => {
  const [claimCode, setClaimCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(memberId, claimCode);
  };

  return (
    <div className="ov-main-container">
      <div className="ov-verification-panel">
        <div className="ov-panel-header">
          <h2>Order Verification</h2>
          <p>Verify member orders using their ID and claim code</p>
        </div>
        
        <form onSubmit={handleSubmit} className="ov-verification-form">
          <div className="ov-form-group">
            <label htmlFor="memberId" className="ov-form-label">Member ID</label>
            <input
              type="text"
              id="memberId"
              className="ov-form-input"
              value={memberId}
              onChange={(e) => onMemberIdChange(e.target.value)}
              placeholder="Enter member ID"
              required
            />
          </div>
          
          <div className="ov-form-group">
            <label htmlFor="claimCode" className="ov-form-label">Claim Code</label>
            <input
              type="text"
              id="claimCode"
              className="ov-form-input"
              value={claimCode}
              onChange={(e) => setClaimCode(e.target.value)}
              placeholder="Enter claim code"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`ov-verify-btn ${isLoading ? 'ov-verifying' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="ov-spinner"></span>
                Verifying...
              </>
            ) : (
              'Verify Order'
            )}
          </button>
        </form>
        
        <div className="ov-help-section">
          <p>
            <strong>Need help?</strong> The claim code can be found in the order confirmation email 
            or in the member's order history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderVerification;