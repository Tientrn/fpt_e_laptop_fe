import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/homepage/HomePage";
import DashboardPage from "./pages/admin/AdminPage";
import AccountManagementPage from "./pages/admin/AccountPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LaptopforsellPage from "./pages/laptopforsell/LaptopforsellPage";

import DashboardLayout from "./layouts/dashboard";
import HomePageLayout from "./layouts/homepage";
import AuthLayout from "./layouts/auth";
import RegisterLayout from "./layouts/register";

function App() {
  return (
    <>
      <BrowserRouter>
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
                <LaptopforsellPage />
              </HomePageLayout>
            }
          ></Route>

          {/* thêm route từ đây */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
