import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddProduct from "./components/seller/AddProduct";
import EditProduct from "./components/seller/EditProduct";
import NavBar from "./nav/NavBar";
import Footer from "./nav/Footer";
import BackToTop from "./components/common/BackToTop";
import Signup from "./components/auth/signup";
import Login from "./components/auth/login";
import SellerLogin from "./components/auth/SellerLogin";
import SellerSignup from "./components/auth/SellerSignup";
import ForgotPassword from "./components/auth/ForgotPassword";
import { useSelector } from "react-redux";
import CustomerHome from "./components/customer/CustomerHome";
import Home from "./components/customer/Home";
import SellerHome from "./components/seller/SellerHome";
import SellerProducts from "./components/seller/SellerProducts";
import Cart from "./components/customer/cart/Cart";
import Checkout from "./components/customer/checkout/Checkout";
import Orders from "./components/customer/Orders";
import ProductDetails from "./components/customer/ProductDetails";
import Wishlist from "./components/customer/Wishlist";
import CategoryPage from "./components/customer/CategoryPage";
import Profile from "./components/customer/Profile";
import Security from "./components/customer/Security";
import ContactUs from "./components/customer/ContactUs";

function App() {
  const { userType } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={userType === "seller" ? <SellerHome /> : <Home />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/products" element={userType === "seller" ? <SellerProducts /> : <CustomerHome />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/security" element={<Security />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/seller/login" element={<SellerLogin />} />
            <Route path="/seller/signup" element={<SellerSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
          <Footer />
          <BackToTop />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
