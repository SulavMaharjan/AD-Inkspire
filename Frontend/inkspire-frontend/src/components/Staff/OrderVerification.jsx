import React, { useState } from "react";
import { Search } from "lucide-react";
import "../../styles/OrderVerification.css";

const OrderVerification = ({ onVerify }) => {
  const [claimCode, setClaimCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);

    // Simulate API delay
    setTimeout(() => {
      const result = onVerify(claimCode);
      if (!result) {
        setIsVerifying(false);
      }
    }, 800);
  };

  return (
    <div className="order-verification">
      <div className="verification-container">
        <div className="verification-header">
          <h2>Verify Order</h2>
          <p>Enter the member's ID and claim code to process their order</p>
        </div>

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="form-group">
            <label htmlFor="claimCode">Claim Code</label>
            <input
              type="text"
              id="claimCode"
              placeholder="e.g., BKST-12345"
              value={claimCode}
              onChange={(e) => setClaimCode(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`verify-button ${isVerifying ? "verifying" : ""}`}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <div className="spinner"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Verify Order</span>
              </>
            )}
          </button>
        </form>

        <div className="verification-help">
          <p>
            <strong>Need help?</strong> If you can't find the order, ask the
            member to show their confirmation email or check the order status in
            their account.
          </p>
        </div>
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <div className="order-list">
          <div className="order-item">
            <div className="order-info">
              <span className="order-number">ORD-98765</span>
              <span className="member-name">John Doe</span>
            </div>
            <span className="order-time">5 minutes ago</span>
          </div>
          <div className="order-item">
            <div className="order-info">
              <span className="order-number">ORD-98764</span>
              <span className="member-name">Alice Williams</span>
            </div>
            <span className="order-time">12 minutes ago</span>
          </div>
          <div className="order-item">
            <div className="order-info">
              <span className="order-number">ORD-98762</span>
              <span className="member-name">Robert Johnson</span>
            </div>
            <span className="order-time">34 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderVerification;
