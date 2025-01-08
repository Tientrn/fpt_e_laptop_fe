import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/Scroll";

import AuthLayout from "./layouts/auth";
import HomePageLayout from "./layouts/homepage";
import RegisterLayout from "./layouts/register";
import DashboardLayout from "./layouts/dashboard";

import HomePage from "./pages/homepage/HomePage";
import DashboardPage from "./pages/admin/AdminPage";
import AccountManagementPage from "./pages/admin/AccountPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LaptoppurchaseDetail from "./pages/laptopforsell/LaptoppurchaseDetail";
import DetailLaptopBorrowPage from "./pages/homepage/DetailLaptopBorrow";
import LaptoppurchasePage from "./pages/laptopforsell/LaptoppurchasePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* thêm route từ đây */}

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
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
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
              <RegisterLayout>
                <RegisterPage />
              </RegisterLayout>
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
            path="/laptoppurchasedetail"
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
                <DetailLaptopBorrowPage />
              </HomePageLayout>
            }
          ></Route>

          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
