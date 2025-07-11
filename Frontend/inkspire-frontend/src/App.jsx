import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CartProvider } from "./context/CartContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import {
  ProtectedRoute,
  AdminProtectedRoute,
  MemberProtectedRoute,
  StaffProtectedRoute,
} from "./components/Auth/ProtectedRoute";

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
import CartPage from "./pages/CartPage";
import MemberManagement from "./components/admin/MemberManagement";
import AdminLayout from "./components/admin/AdminLayout";
import BookManagement from "./components/admin/BookManagement";
import AdminDashboard from "./pages/AdminDashboard";
import StaffManagement from "./components/Staff/StaffManagement";
import UserProfilePage from "./pages/UserProfilePage";

const AdminDashboardWrapper = () => (
  <AdminLayout>
    <AdminDashboard />
  </AdminLayout>
);

const AdminAddBookWrapper = () => (
  <AdminLayout>
    <AddBookPage />
  </AdminLayout>
);

const AdminManageBookWrapper = () => (
  <AdminLayout>
    <BookManagement />
  </AdminLayout>
);

const AdminAnnouncementsWrapper = () => (
  <AdminLayout>
    <AnnouncementManagement />
  </AdminLayout>
);

const AdminMembersWrapper = () => (
  <AdminLayout>
    <MemberManagement />
  </AdminLayout>
);
const AdminStaffWrapper = () => (
  <AdminLayout>
    <StaffManagement />
  </AdminLayout>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/books" element={<BookListing />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/bookDetail/:id" element={<BookDetails />} />
              <Route path="/orderedBook" element={<PurchasedBooks />} />
              <Route path="/bookmarkedlist" element={<BookmarkedList />} />

              {/* Admin protected routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminProtectedRoute>
                    <Routes>
                      <Route
                        path="dashboard"
                        element={<AdminDashboardWrapper />}
                      />
                      <Route
                        path="add-book"
                        element={<AdminAddBookWrapper />}
                      />
                      <Route
                        path="books"
                        element={<AdminManageBookWrapper />}
                      />
                      <Route
                        path="announcements"
                        element={<AdminAnnouncementsWrapper />}
                      />
                      <Route path="members" element={<AdminMembersWrapper />} />
                      <Route path="staffs" element={<AdminStaffWrapper />} />
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
                      <Route path="cart" element={<CartPage />} />
                      <Route path="profile" element={<UserProfilePage />} />
                      <Route path="cart" element={<CartPage />} />
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
                      <Route path="/staffclaimcode" element={<StaffPage />} />
                    </Routes>
                  </StaffProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
