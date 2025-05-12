import React, { useState } from "react";
import "../../styles/OrderVerification.css";

const OrderVerification = ({ onVerify, memberId, onMemberIdChange }) => {
  const [claimCode, setClaimCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(memberId, claimCode);
  };

  return (
    <div className="order-verification">
      <h2>Order Verification</h2>
      <form onSubmit={handleSubmit} className="verification-form">
        <div className="form-group">
          <label htmlFor="memberId">Member ID</label>
          <input
            type="text"
            id="memberId"
            value={memberId}
            onChange={(e) => onMemberIdChange(e.target.value)}
            placeholder="Enter member ID"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="claimCode">Claim Code</label>
          <input
            type="text"
            id="claimCode"
            value={claimCode}
            onChange={(e) => setClaimCode(e.target.value)}
            placeholder="Enter claim code"
            required
          />
        </div>
        <button type="submit" className="verify-button">
          Verify Order
        </button>
      </form>
    </div>
  );
};

export default OrderVerification;
