import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/routes/PrivateRoute";
import ScrollToTop from "./components/routes/ScrollToTop";

import AuthLayout from "./layouts/Auth";
import HomePageLayout from "./layouts/Homepage";
import { SponsorLayout } from "./layouts/SponsorLayout";
import StaffLayout from "./layouts/StaffLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/homepage/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AnalyticPage from "./pages/admin/AnalyticPage";
import ContentPage from "./pages/admin/ContentPage";
import ReportPage from "./pages/admin/ReportPage";

import BorrowListingPage from "./components/page-base/listlaptopborrow/BorrowListingPage";
import Cart from "./pages/shoppingcart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import ProfilePage from "./pages/profile/ProfilePage";
import RegisterShopPage from "./pages/shop/RegisterShopPage";
import RegisterSponsor from "./pages/sponsor/RegisterSponsor";
import LaptopInfo from "./pages/sponsor/LaptopInfo";
import LaptopStatus from "./pages/sponsor/LaptopStatus";
import ConfirmationPage from "./components/page-base/detailborrow/ConfirmationPage";
import BorrowHistory from "./pages/staff/BorrowHistory";
import BorrowRequest from "./pages/staff/BorrowRequest";
import Statistics from "./pages/staff/Statistics";
import CardDetail from "./components/page-base/listlaptopborrow/CardDetail";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <HomePageLayout>
              <HomePage />
            </HomePageLayout>
          }
        />
        <Route
          path="/home"
          element={
            <HomePageLayout>
              <HomePage />
            </HomePageLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/laptopborrow"
          element={
            <PrivateRoute>
              <HomePageLayout>
                <BorrowListingPage />
              </HomePageLayout>
            </PrivateRoute>
          }
        />
        {/* Shopping Routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <HomePageLayout>
                <Cart />
              </HomePageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        {/* Profile and Shop Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <HomePageLayout>
                <ProfilePage />
              </HomePageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/registershop"
          element={
            <PrivateRoute>
              <RegisterShopPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/borrow/:id/confirm"
          element={
            <PrivateRoute>
              <ConfirmationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/borrow/:id"
          element={
            <PrivateRoute>
              <CardDetail />
            </PrivateRoute>
          }
        />

        {/* Sponsor Routes */}
        <Route path="/sponsor" element={<SponsorLayout />}>
          <Route index element={<RegisterSponsor />} />
          <Route path="register" element={<RegisterSponsor />} />
          <Route path="laptop-info" element={<LaptopInfo />} />
          <Route path="laptop-status" element={<LaptopStatus />} />
        </Route>

        {/* Staff Routes */}
        <Route
          path="/staff"
          element={
            <PrivateRoute>
              <StaffLayout>
                <Navigate to="/staff/borrow-requests" replace />
              </StaffLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/staff/borrow-history"
          element={
            <PrivateRoute>
              <StaffLayout>
                <BorrowHistory />
              </StaffLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/staff/borrow-requests"
          element={
            <PrivateRoute>
              <StaffLayout>
                <BorrowRequest />
              </StaffLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/staff/statistics"
          element={
            <PrivateRoute>
              <StaffLayout>
                <Statistics />
              </StaffLayout>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            // <PrivateRoute>
            <AdminLayout>
              <Navigate to="/admin/analytics" replace />
            </AdminLayout>
            // </PrivateRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            // <PrivateRoute>
            <AdminLayout>
              <AnalyticPage />
            </AdminLayout>
            // </PrivateRoute>
          }
        />

        <Route
          path="/admin/content"
          element={
            // <PrivateRoute>
            <AdminLayout>
              <ContentPage />
            </AdminLayout>
            // </PrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            // <PrivateRoute>
            <AdminLayout>
              <ReportPage />
            </AdminLayout>
            // </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
