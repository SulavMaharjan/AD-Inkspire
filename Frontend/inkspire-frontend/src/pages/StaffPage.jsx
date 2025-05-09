import React, { useState } from 'react';
import StaffHeader from '../components/Staff/StaffHeader';
import OrderVerification from '../components/Staff/OrderVerification';
import OrderDetails from '../components/Staff/OrderDetails';
import ProcessingComplete from '../components/Staff/ProcessingComplete';
import Sidebar from '../components/Staff/Sidebar';
import '../styles/StaffPage.css';

const StaffPage = () => {
  const [currentStep, setCurrentStep] = useState('verification');
  const [order, setOrder] = useState(null);
  const [notification, setNotification] = useState(null);

  // Mock function to verify order
  const verifyOrder = (membershipId, claimCode) => {
    // This would be an API call in a real application
    if (membershipId && claimCode) {
      // Mock order data
      const mockOrder = {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        membershipId,
        claimCode,
        member: {
          id: membershipId,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          purchaseCount: 27,
          joinDate: '2021-06-15',
        },
        date: new Date().toISOString(),
        items: [
          {
            id: 1,
            title: 'The Midnight Library',
            author: 'Matt Haig',
            format: 'Hardcover',
            price: 22.99,
            quantity: 1,
            coverUrl: 'https://source.unsplash.com/random/400x600/?book,cover',
          },
          {
            id: 2,
            title: 'Project Hail Mary',
            author: 'Andy Weir',
            format: 'Paperback',
            price: 16.99,
            quantity: 1,
            coverUrl: 'https://source.unsplash.com/random/400x600/?book,scifi',
          },
          {
            id: 3,
            title: 'The Song of Achilles',
            author: 'Madeline Miller',
            format: 'Special Edition',
            price: 24.99,
            quantity: 2,
            coverUrl: 'https://source.unsplash.com/random/400x600/?book,mythology',
          },
        ],
        subtotal: 89.96,
        discount: {
          type: '5% bulk discount',
          amount: 4.50,
        },
        loyaltyDiscount: {
          type: '10% loyalty discount (2 available)',
          amount: 8.55,
        },
        total: 76.91,
        status: 'pending',
      };

      setOrder(mockOrder);
      setCurrentStep('details');
      return true;
    }
    
    showNotification('Invalid membership ID or claim code', 'error');
    return false;
  };

  // Process the order
  const processOrder = () => {
    // This would be an API call in a real application
    setTimeout(() => {
      setOrder({
        ...order,
        status: 'processed',
        processedAt: new Date().toISOString(),
        processedBy: 'Staff Member',
      });
      setCurrentStep('complete');
      showNotification('Order processed successfully', 'success');
    }, 1000);
  };

  // Reset the form to process another order
  const resetForm = () => {
    setOrder(null);
    setCurrentStep('verification');
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="staff-page">
      <Sidebar />
      <div className="staff-content">
        <StaffHeader notification={notification} />
        
        <main className="staff-main">
          {currentStep === 'verification' && (
            <OrderVerification onVerify={verifyOrder} />
          )}
          
          {currentStep === 'details' && order && (
            <OrderDetails 
              order={order} 
              onProcess={processOrder} 
              onCancel={resetForm} 
            />
          )}
          
          {currentStep === 'complete' && order && (
            <ProcessingComplete 
              order={order}
              onProcessAnother={resetForm}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default StaffPage;