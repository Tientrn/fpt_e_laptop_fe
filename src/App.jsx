import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./layouts/admin";
import DashboardPage from "./pages/admin/adminpage";
import AccountManagementPage from "./pages/admin/AccountPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
