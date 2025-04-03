import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import ScrollToTop from "./components/routes/ScrollToTop";
{
  /* Layout */
}
import AuthLayout from "./layouts/Auth";
import HomePageLayout from "./layouts/Homepage";
import { SponsorLayout } from "./layouts/SponsorLayout";
import StaffLayout from "./layouts/StaffLayout";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
{
  /* Admin */
}
import HomePage from "./pages/homepage/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AnalyticPage from "./pages/admin/AnalyticPage";
import ContentPage from "./pages/admin/ContentPage";
import ReportPage from "./pages/admin/ReportPage";
{
  /* Student */
}
import ProfilePage from "./pages/student/ProfilePage";
import Contractstudent from "./pages/student/Contractstudent";
import RequestsPage from "./pages/student/RequestsPage";
{
  /* Staff */
}
import BorrowHistory from "./pages/staff/BorrowHistory";
import BorrowRequest from "./pages/staff/BorrowRequest";
import Statistics from "./pages/staff/Statistics";
import ContractsPage from "./pages/staff/ContractsPage";
import DepositPage from "./pages/staff/DepositPage";
{
  /* Sponsor */
}
import RegisterShopPage from "./pages/shop/RegisterShopPage";
import RegisterSponsor from "./pages/sponsor/RegisterSponsor";
import LaptopInfo from "./pages/sponsor/LaptopInfo";
import LaptopStatus from "./pages/sponsor/LaptopStatus";
{
  /* Others */
}
import BorrowListingPage from "./components/page-base/listlaptopborrow/BorrowListingPage";
import Cart from "./pages/shoppingcart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import ConfirmationPage from "./components/page-base/detailborrow/ConfirmationPage";
import CardDetail from "./components/page-base/listlaptopborrow/CardDetail";
import LaptopShopPage from "./pages/shop/LaptopShopPage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";

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
            // <PrivateRoute>
            <HomePageLayout>
              <BorrowListingPage />
            </HomePageLayout>
            // </PrivateRoute>
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
            <HomePageLayout>
              <CardDetail />
            </HomePageLayout>
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
        <Route path="/staff" element={<StaffLayout />}>
          <Route
            index
            element={<Navigate to="/staff/borrow-requests" replace />}
          />
          <Route path="borrow-requests" element={<BorrowRequest />} />
          <Route path="borrow-history" element={<BorrowHistory />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="deposits/create/:contractId" element={<DepositPage />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="contractstudent" element={<Contractstudent />} />
        </Route>

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

        <Route
          path="/laptopshop"
          element={
            <HomePageLayout>
              <LaptopShopPage />
            </HomePageLayout>
          }
        />

        <Route
          path="/laptopshop/:id"
          element={
            <HomePageLayout>
              <ProductDetailPage />
            </HomePageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
