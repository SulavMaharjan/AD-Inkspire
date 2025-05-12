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
  //numeric status to readable string
  const orderStatus = ORDER_STATUS[order.status] || order.status;

  return (
    <div className="order-details">
      <h2>Order Details</h2>
      <div className="order-info">
        <p>
          <strong>Member ID:</strong> {memberId}
        </p>
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Claim Code:</strong> {order.claimCode}
        </p>
        <p>
          <strong>Status:</strong> {orderStatus}
        </p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="order-items">
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.bookTitle}</td>
                <td>{item.quantity}</td>
                <td>
                  $
                  {item.discountedPrice
                    ? item.discountedPrice.toFixed(2)
                    : item.unitPrice.toFixed(2)}
                </td>
                <td>${item.subTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="order-totals">
        <p>
          <strong>Subtotal:</strong> ${order.subTotal.toFixed(2)}
        </p>
        {order.discountAmount > 0 && (
          <p>
            <strong>Discount:</strong> -${order.discountAmount.toFixed(2)}
          </p>
        )}
        <p className="total">
          <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
        </p>
      </div>

      <div className="action-buttons">
        <button onClick={onCancel} className="cancel-button">
          Cancel
        </button>
        <button onClick={onProcess} className="process-button">
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
