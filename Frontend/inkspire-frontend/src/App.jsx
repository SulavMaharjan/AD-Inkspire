import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import {
  ProtectedRoute,
  AdminProtectedRoute,
  MemberProtectedRoute,
  StaffProtectedRoute,
} from "./components/Auth/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./components/UnauthorizedPage";
import BookListing from "./components/BookCatalog/BookListing";
import AddBookPage from "./pages/AddBookPage";
import BookDetails from "./pages/BookDetails";
import PurchasedBooks from "./pages/PurchasedBooks";
import "./styles/App.css";
import StaffPage from "./pages/StaffPage";
import BookmarkedList from "./pages/BookmarkedList";
import AnnouncementManagement from "./components/admin/AnnouncementManagement";
import MemberManagement from "./components/admin/MemberManagement";
import AdminLayout from "./components/admin/AdminLayout";

// Create an AdminDashboard wrapper component
const AdminDashboardWrapper = () => {
  return (
    <AdminLayout>
      <div>Admin Dashboard</div>
    </AdminLayout>
  );
};

// Create an AdminAddBook wrapper component
const AdminAddBookWrapper = () => {
  return (
    <AdminLayout>
      <AddBookPage />
    </AdminLayout>
  );
};

// Create an AdminAnnouncements wrapper component
const AdminAnnouncementsWrapper = () => {
  return (
    <AdminLayout>
      <AnnouncementManagement />
    </AdminLayout>
  );
};

// Create an AdminMembers wrapper component
const AdminMembersWrapper = () => {
  return (
    <AdminLayout>
      <MemberManagement />
    </AdminLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/books" element={<BookListing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/bookDetail/:id" element={<BookDetails />} />
            <Route path="/purchasedBook" element={<PurchasedBooks />} />
            <Route path="/bookmarkedlist" element={<BookmarkedList />} />
            <Route path="/staffclaimcode" element={<StaffPage />} />
       
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            {/* Admin protected routes */}
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboardWrapper />} />
                    <Route path="add-book" element={<AdminAddBookWrapper />} />
                    <Route path="announcements" element={<AdminAnnouncementsWrapper />} />
                    <Route path="members" element={<AdminMembersWrapper />} />
                  </Routes>
                </AdminProtectedRoute>
              }
            />
            
            {/* Member protected routes */}
            <Route
              path="/member/*"
              element={
                <MemberProtectedRoute>
                  <Routes>
                    <Route path="profile" element={<div>Member Profile</div>} />
                    <Route
                      path="wishlist"
                      element={<div>My Favorite Books</div>}
                    />
                  </Routes>
                </MemberProtectedRoute>
              }
            />
            
            {/* Staff protected routes */}
            <Route
              path="/staff/*"
              element={
                <StaffProtectedRoute>
                  <Routes>
                    <Route
                      path="manage-orders"
                      element={<div>Manage Orders</div>}
                    />
                  </Routes>
                </StaffProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;