import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/Scroll";
import ProtectedRoute from "./components/ProtectedRoute";

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
          {/* thêm route từ đây */}

          <Route
            path="/"
            element={
              <HomePageLayout>
                <HomePage />
              </HomePageLayout>
            }
          ></Route>
          <Route
            path="/home"
            element={
              <HomePageLayout>
                <HomePage />
              </HomePageLayout>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/account"
            element={
              <DashboardLayout>
                <AccountManagementPage />
              </DashboardLayout>
            }
          ></Route>
          <Route
            path="/history"
            element={
              <DashboardLayout>
                <HistoryPaymentPage />
              </DashboardLayout>
            }
          ></Route>
          <Route
            path="/analytic"
            element={
              <DashboardLayout>
                <AnalyticPage />
              </DashboardLayout>
            }
          ></Route>
          <Route
            path="/content"
            element={
              <DashboardLayout>
                <ContentPage />
              </DashboardLayout>
            }
          ></Route>
          <Route
            path="/report"
            element={
              <DashboardLayout>
                <ReportPage />
              </DashboardLayout>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          ></Route>
          <Route
            path="/register"
            element={
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            }
          ></Route>
          <Route
            path="/laptoppurchase"
            element={
              <HomePageLayout>
                <LaptoppurchasePage />
              </HomePageLayout>
            }
          ></Route>
          <Route
            path="/laptoppurchasedetail/:productId"
            element={
              <HomePageLayout>
                <LaptoppurchaseDetail />
              </HomePageLayout>
            }
          ></Route>
          <Route
            path="/laptopborrow"
            element={
              <HomePageLayout>
                <LaptopborrowPage />
              </HomePageLayout>
            }
          ></Route>
          <Route
            path="/cart"
            element={
              <HomePageLayout>
                <Cart />
              </HomePageLayout>
            }
          ></Route>
          <Route
            path="/profile"
            element={
              <HomePageLayout>
                <ProfilePage />
              </HomePageLayout>
            }
          ></Route>
          <Route path="/checkout" element={<CheckoutPage />}></Route>
          <Route path="/registershop" element={<RegisterShopPage />}></Route>
          <Route path="/sponsor" element={<SponsorLayout />}>
            <Route index element={<RegisterSponsor />} />
            <Route path="register" element={<RegisterSponsor />} />
            <Route path="laptop-info" element={<LaptopInfo />} />
            <Route path="laptop-status" element={<LaptopStatus />} />
          </Route>
          
          <Route path="/detailborrow/:id" element={<DetailLaptopBorrow />} />
          <Route path="/borrow/:id/confirm" element={<ConfirmationPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
