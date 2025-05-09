import React, { useState } from "react";
import { Check, X, Package, AlertCircle } from "lucide-react";
import "../../styles/OrderDetails.css";

const OrderDetails = ({ order, onProcess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemsChecked, setItemsChecked] = useState({});

  const allItemsChecked =
    Object.keys(itemsChecked).length === order.items.length &&
    Object.values(itemsChecked).every((value) => value === true);

  const handleItemCheck = (itemId) => {
    setItemsChecked((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleProcessOrder = () => {
    setIsProcessing(true);
    // Process after a small delay to show loading state
    setTimeout(() => {
      onProcess();
    }, 1000);
  };

  return (
    <div className="order-details">
      <div className="order-details-header">
        <div className="order-metadata">
          <h2>Order Details</h2>
          <div className="order-identification">
            <span className="order-id">Order ID: {order.id}</span>
            <span className="claim-code">Claim Code: {order.claimCode}</span>
          </div>
        </div>
        <div className="member-info">
          <h3>Member Information</h3>
          <div className="member-details">
            <p>
              <strong>Name:</strong> {order.member.name}
            </p>
            <p>
              <strong>ID:</strong> {order.member.id}
            </p>
            <p>
              <strong>Email:</strong> {order.member.email}
            </p>
            <p>
              <strong>Orders:</strong> {order.member.purchaseCount}
            </p>
            <p>
              <strong>Member since:</strong>{" "}
              {new Date(order.member.joinDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="items-container">
        <h3>Order Items</h3>
        <div className="order-items">
          {order.items.map((item) => (
            <div
              key={item.id}
              className={`order-item ${itemsChecked[item.id] ? "checked" : ""}`}
              onClick={() => handleItemCheck(item.id)}
            >
              <div className="item-check">
                {itemsChecked[item.id] ? (
                  <div className="check-circle">
                    <Check size={16} />
                  </div>
                ) : (
                  <div className="empty-circle"></div>
                )}
              </div>

              <div className="item-image">
                <img src={item.coverUrl} alt={item.title} />
              </div>

              <div className="item-details">
                <h4>{item.title}</h4>
                <p className="item-author">by {item.author}</p>
                <div className="item-meta">
                  <span className="item-format">{item.format}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
              </div>

              <div className="item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary">
        <div className="summary-details">
          <div className="summary-line">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>

          {order.discount && (
            <div className="summary-line discount">
              <span>{order.discount.type}</span>
              <span>-${order.discount.amount.toFixed(2)}</span>
            </div>
          )}

          {order.loyaltyDiscount && (
            <div className="summary-line loyalty-discount">
              <span>{order.loyaltyDiscount.type}</span>
              <span>-${order.loyaltyDiscount.amount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-line total">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="order-actions">
        <div className="item-verification">
          {!allItemsChecked && (
            <div className="verification-reminder">
              <AlertCircle size={18} />
              <span>
                Please verify all items are available before processing
              </span>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={isProcessing}
          >
            <X size={18} />
            <span>Cancel</span>
          </button>

          <button
            className={`process-button ${allItemsChecked ? "ready" : ""} ${
              isProcessing ? "processing" : ""
            }`}
            onClick={handleProcessOrder}
            disabled={!allItemsChecked || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Package size={18} />
                <span>Process Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
