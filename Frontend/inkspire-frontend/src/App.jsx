import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

function App() {
  return (
    <AuthProvider>
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
                  <Route
                    path="dashboard"
                    element={<div>Admin Dashboard</div>}
                  />
                  <Route path="add-book" element={<AddBookPage />} />

                  <Route path="users" element={<div>User Management</div>} />
                  <Route path="settings" element={<div>Admin Settings</div>} />
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
    </AuthProvider>
  );
}

export default App;
