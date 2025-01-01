import "./App.css";
import DashboardLayout from "./layouts/admin";
import DashboardPage from "./pages/adminpage";
function App() {
  return (
    <>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </>
  );
}

export default App;
