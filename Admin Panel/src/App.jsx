import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { adminLogout } from "./store/slices/adminSlice";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";

function SessionExpiryHandler() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.admin.adminToken);

  useEffect(() => {
    if (!token) return undefined;

    const expireSession = () => {
      dispatch(adminLogout());
      navigate("/login", { replace: true });
    };

    let expiresAt;
    try {
      const payload = token.split(".")[1];
      if (!payload) throw new Error("Invalid JWT");
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
      expiresAt = decoded.exp * 1000;
    } catch {
      expireSession();
      return undefined;
    }

    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      expireSession();
      return undefined;
    }

    const timeout = window.setTimeout(expireSession, expiresAt - Date.now());
    return () => window.clearTimeout(timeout);
  }, [dispatch, navigate, token]);

  return null;
}

const ProtectedAdmin = ({ children }) => {
  const adminToken = useSelector((s) => s.admin.adminToken);
  return adminToken ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <SessionExpiryHandler />
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
