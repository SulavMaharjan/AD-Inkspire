import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StaffHeader from "../components/Staff/StaffHeader";
import OrderVerification from "../components/Staff/OrderVerification";
import OrderDetails from "../components/Staff/OrderDetails";
import ProcessingComplete from "../components/Staff/ProcessingComplete";
import "../styles/StaffPage.css";
import axios from "axios";

const StaffPage = () => {
  const { currentRole, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState("verification");
  const [order, setOrder] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [memberId, setMemberId] = useState("");

  const API_BASE_URL = "https://localhost:7039/api";

  const verifyOrder = async (memberId, claimCode) => {
    //check user is authenticated and has staff role
    if (!isAuthenticated()) {
      showNotification("Please log in to continue", "error");
      return false;
    }

    if (currentRole?.toLowerCase() !== "staff") {
      showNotification(
        "You do not have permission to access this page",
        "error"
      );
      return false;
    }

    if (!memberId || !claimCode) {
      showNotification("Please provide both member ID and claim code", "error");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const staffToken = localStorage.getItem("token");
      if (!staffToken) {
        showNotification(
          "Authentication token not found. Please log in again.",
          "error"
        );
        return false;
      }

      //fetch order details
      const response = await axios.get(
        `${API_BASE_URL}/orders/claim/${claimCode}`,
        {
          params: {
            memberId: memberId,
          },
          headers: {
            Authorization: `Bearer ${staffToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      //checking order exists
      if (response.data) {
        //verify the order belongs to the member
        if (
          response.data.userId &&
          response.data.userId.toString() !== memberId
        ) {
          showNotification(
            "This order does not belong to the provided member ID",
            "error"
          );
          setLoading(false);
          return false;
        }

        setOrder(response.data);
        setCurrentStep("details");
        setLoading(false);
        return true;
      } else {
        showNotification(
          "Order not found with the provided claim code",
          "error"
        );
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Error verifying order:", err);

      let errorMessage = "Failed to verify order. Please try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (err.response.status === 404) {
          errorMessage = "Order not found with the provided claim code";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
      showNotification(errorMessage, "error");
      setLoading(false);
      return false;
    }
  };

  const processOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const staffToken = localStorage.getItem("token");
      if (!staffToken) {
        throw new Error("No authentication token found");
      }

      //verify the order using the claim code
      await axios.post(
        `${API_BASE_URL}/orders/verify`,
        {
          claimCode: order.claimCode,
        },
        {
          headers: {
            Authorization: `Bearer ${staffToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOrder({
        ...order,
        status: "Completed",
        updatedAt: new Date().toISOString(),
      });

      setCurrentStep("complete");
      showNotification("Order processed successfully", "success");
      setLoading(false);
    } catch (err) {
      console.error("Error processing order:", err);

      let errorMessage = "Failed to process order. Please try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
      showNotification(errorMessage, "error");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOrder(null);
    setCurrentStep("verification");
    setError(null);
    setMemberId("");
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  if (!isAuthenticated() || currentRole?.toLowerCase() !== "staff") {
    return (
      <div className="staff-access-denied">
        <h2>Access Denied</h2>
        <p>You must be logged in as a staff member to access this page.</p>
      </div>
    );
  }

  return (
    <div className="staff-page">
      <div className="staff-content">
        <StaffHeader onLogout={() => navigate("/login")} />

        <main className="staff-main">
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Processing...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {currentStep === "verification" && (
            <OrderVerification
              onVerify={verifyOrder}
              memberId={memberId}
              onMemberIdChange={setMemberId}
            />
          )}

          {currentStep === "details" && order && (
            <OrderDetails
              order={order}
              memberId={memberId}
              onProcess={processOrder}
              onCancel={resetForm}
            />
          )}

          {currentStep === "complete" && order && (
            <ProcessingComplete
              order={order}
              memberId={memberId}
              onProcessAnother={resetForm}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
