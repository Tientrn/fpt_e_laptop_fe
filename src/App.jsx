import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './components/routes/PrivateRoute';
import ScrollToTop from './components/routes/ScrollToTop';

import AuthLayout from "./layouts/auth";
import HomePageLayout from "./layouts/homepage";
import { SponsorLayout } from "./layouts/SponsorLayout";
import DashboardLayout from "./layouts/dashboard";

import HomePage from "./pages/homepage/HomePage";
import DashboardPage from "./pages/admin/AdminPage";
import AccountManagementPage from "./pages/admin/AccountPage";
import AnalyticPage from "./pages/admin/AnalyticPage";
import ContentPage from "./pages/admin/ContentPage";
import ReportPage from "./pages/admin/ReportPage";
import HistoryPaymentPage from "./pages/admin/HistoryPaymentPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import LaptoppurchaseDetail from "./pages/laptopforsell/LaptoppurchaseDetail";
import LaptoppurchasePage from "./pages/laptopforsell/LaptoppurchasePage";
import LaptopborrowPage from "./pages/laptopborrow/LaptopBorrowPage";
import DetailLaptopBorrow from './components/page-base/detailborrow/DetailLaptopBorrow';

import Cart from "./pages/shoppingcart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import ProfilePage from "./pages/profile/ProfilePage";
import RegisterShopPage from "./pages/shop/RegisterShopPage";
import RegisterSponsor from "./pages/sponsor/RegisterSponsor";
import LaptopInfo from "./pages/sponsor/LaptopInfo";
import LaptopStatus from "./pages/sponsor/LaptopStatus";
import ConfirmationPage from './components/page-base/detailborrow/ConfirmationPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePageLayout>
            <HomePage />
          </HomePageLayout>} />
          <Route path="/home" element={<HomePageLayout>
            <HomePage />
          </HomePageLayout>} />
          <Route path="/login" element={<AuthLayout>
            <LoginPage />
          </AuthLayout>} />
          <Route path="/register" element={<AuthLayout>
            <RegisterPage />
          </AuthLayout>} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <AccountManagementPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <HistoryPaymentPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytic"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <AnalyticPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/content"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ContentPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ReportPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Laptop Routes */}
          <Route
            path="/laptoppurchase"
            element={
              <HomePageLayout>
                <LaptoppurchasePage />
              </HomePageLayout>
            }
          />
          <Route
            path="/laptoppurchasedetail/:productId"
            element={
              <PrivateRoute>
                <HomePageLayout>
                  <LaptoppurchaseDetail />
                </HomePageLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/laptopborrow"
            element={
              <HomePageLayout>
                <LaptopborrowPage />
              </HomePageLayout>
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

          {/* Sponsor Routes */}
          <Route path="/sponsor" element={<SponsorLayout />}>
            <Route index element={<RegisterSponsor />} />
            <Route path="register" element={<RegisterSponsor />} />
            <Route path="laptop-info" element={<LaptopInfo />} />
            <Route path="laptop-status" element={<LaptopStatus />} />
          </Route>

          {/* Borrow Detail Routes */}
          <Route
            path="/detailborrow/:id"
            element={
              <PrivateRoute>
                <DetailLaptopBorrow />
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
