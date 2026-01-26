import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import HomeAdmin from "./pages/HomeAdmin";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetailAdmin from "./pages/ProductDetailAdmin";
import CustomerAdmin from "./pages/CustomerAdmin";



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>

            <ToastContainer autoClose={3000} hideProgressBar />

            <Navbar />

            <div className="main_content_container">
              <Routes>
                
                {/* USER */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* ADMIN */}
                <Route path="/admin" element={<HomeAdmin />} />
                <Route path="/admin/products" element={<Admin />} />
                <Route path="/admin/orders" element={<Admin />} />
                <Route path="/admin/detail/:id" element={<ProductDetailAdmin />} />
                <Route path="/admin/product/:id" element={<ProductDetailAdmin />} />
                <Route path="/admin/detail :id/:id" element={<ProductDetailAdmin />} />
                <Route path="/admin/customers" element={<CustomerAdmin />} />

              </Routes>
            </div>

            <Footer />

          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
