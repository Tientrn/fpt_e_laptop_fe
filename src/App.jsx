import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import ScrollToTop from "./components/routes/ScrollToTop";
import SponsorRegisterGuard from "./components/routes/SponsorRegisterGuard";

{
  /* Layout */
}
import AuthLayout from "./layouts/AuthLayout";
import HomePageLayout from "./layouts/HomepageLayout";
import { SponsorLayout } from "./layouts/SponsorLayout";
import StaffLayout from "./layouts/StaffLayout";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import ShopLayout from "./layouts/ShopLayout";
import ManagerLayout from "./layouts/ManagerLayout";
{
  /* Admin */
}
import HomePage from "./pages/homepage/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AnalyticPage from "./pages/admin/AnalyticPage";
import ShopManager from "./pages/admin/ShopManager";
import ReportPage from "./pages/admin/ReportPage";
import AdminPage from "./pages/admin/AdminPage";
{
  /* Shop */
}
import MyProducts from "./components/shop/dashboardshop/MyProductShop";
import ShopOrders from "./components/shop/dashboardshop/ShopOrders";
import AddProduct from "./components/shop/dashboardshop/AddProduct";
import ShopAnalytics from "./components/shop/dashboardshop/ShopAnalytics";
import CreateShopInfo from "./components/shop/dashboardshop/CreateShopInfo";
import ShopProfile from "./components/shop/dashboardshop/ShopProfile";
import EditProduct from "./components/shop/dashboardshop/EditProduct";
import WalletManagement from "./components/shop/dashboardshop/WalletManagement";
{
  /* Student */
}
import ProfilePage from "./pages/student/ProfilePage";
import Contractstudent from "./pages/student/Contractstudent";
import RequestsPage from "./pages/student/RequestsPage";
import BorrowHistoryStudent from "./pages/student/BorrowHistoryStudent";
import BorrowHistoryDetail from "./pages/student/BorrowHistoryDetail";
import OrderStudent from "./pages/student/OrderStudent";
import OrderDetailStudent from "./pages/student/OrderDetailStudent";
{
  /* Staff */
}
import BorrowHistory from "./pages/staff/BorrowHistory";
import Statistics from "./pages/staff/Statistics";
import ContractsPage from "./pages/staff/ContractsPage";
import DepositPage from "./pages/staff/DepositPage";
import DonateItem from "./pages/staff/DonateItem";
import EditDonateItem from "./pages/staff/EditDonateItem";
import CreateDonateItem from "./pages/staff/CreateDonateItem";
import ItemManagement from "./pages/staff/ItemManagement";
import ProductManagement from "./pages/staff/ProductManagement";
import OrderManagement from "./pages/staff/OrderManagement";
import ReportDamage from "./pages/staff/ReportDamage";
{
  /* Manager */
}
import BorrowRequest from "./pages/manager/BorrowRequest";
import OverviewPage from "./pages/manager/OverviewPage";
import OrdersPage from "./pages/manager/OrdersPage";
{
  /* Sponsor */
}
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
import BorrowRequestPage from "./pages/borrow/BorrowRequestPage";

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
            <HomePageLayout>
              <Cart />
            </HomePageLayout>
          }
        />
        <Route
          path="/checkout/:orderId"
          element={
            <PrivateRoute>
              <CheckoutPage />
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
        {/* Shop Routes */}
        <Route path="/shop" element={
          <PrivateRoute allowedRoles={[6]}>
            <ShopLayout />
          </PrivateRoute>
        }>
          <Route path="products" element={<MyProducts />} />
          <Route path="edit-product/:productId" element={<EditProduct />} />
          <Route path="orders" element={<ShopOrders />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="analytics" element={<ShopAnalytics />} />
          <Route path="create-profile" element={<CreateShopInfo />} />
          <Route path="profile" element={<ShopProfile />} />
          <Route path="wallet" element={<WalletManagement />} />
        </Route>

        {/* Sponsor Routes */}
        <Route path="/sponsor" element={
          <PrivateRoute allowedRoles={[2,3]}>
            <SponsorLayout />
          </PrivateRoute>
        }>
          <Route path="register" element={<RegisterSponsor />} />
          <Route path="laptop-info" element={<LaptopInfo />} />
          <Route path="laptop-status" element={<LaptopStatus />} />
        </Route>

        {/* Managerment Routes */}
        <Route path="/manager" element={
          <PrivateRoute allowedRoles={[5]}>
            <ManagerLayout />
          </PrivateRoute>
        }>
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="borrow-requests" element={<BorrowRequest />} />
          <Route path="order-management" element={<OrdersPage />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={
          <PrivateRoute allowedRoles={[4]}>
            <StaffLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/staff" replace />} />
          <Route path="donate-items" element={<DonateItem />} />
          <Route path="edit-item/:itemId" element={<EditDonateItem />} />
          <Route path="borrow-history" element={<BorrowHistory />} />
          <Route path="report-damages" element={<ReportDamage />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="items" element={<ItemManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="create-itemdonate" element={<CreateDonateItem />} />
          <Route path="deposits/create/:contractId" element={<DepositPage />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={
          <PrivateRoute allowedRoles={[2]}>
            <StudentLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/student/profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="contractstudent" element={<Contractstudent />} />
          <Route
            path="borrowhistorystudent"
            element={<BorrowHistoryStudent />}
          />
          <Route
            path="borrowhistorydetailstudent/:borrowHistoryId/:id"
            element={<BorrowHistoryDetail />}
          />
          <Route path="orders" element={<OrderStudent />} />
          <Route path="orderdetail/:orderId" element={<OrderDetailStudent />} />
        </Route>

        <Route
          path="/borrow-request/create/:id"
          element={<BorrowRequestPage />}
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={[1]}>
              <AdminLayout>
                <Navigate to="/admin/accounts" replace />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/accounts"
          element={
            <PrivateRoute allowedRoles={[1]}>
              <AdminLayout>
                <AdminPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <PrivateRoute allowedRoles={[1,5]}>
              <AdminLayout>
                <AnalyticPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/shopmanagement"
          element={
            <PrivateRoute allowedRoles={[1]}>
              <AdminLayout>
                <ShopManager />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute allowedRoles={[1]}>
              <AdminLayout>
                <ReportPage />
              </AdminLayout>
            </PrivateRoute>
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
