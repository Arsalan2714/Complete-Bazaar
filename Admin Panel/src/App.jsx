import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";

const ProtectedAdmin = ({ children }) => {
  const adminToken = useSelector((s) => s.admin.adminToken);
  return adminToken ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<ProtectedAdmin><Dashboard /></ProtectedAdmin>} />
        <Route path="/users" element={<ProtectedAdmin><UsersPage /></ProtectedAdmin>} />
        <Route path="/products" element={<ProtectedAdmin><ProductsPage /></ProtectedAdmin>} />
        <Route path="/orders" element={<ProtectedAdmin><OrdersPage /></ProtectedAdmin>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
