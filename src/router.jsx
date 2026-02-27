import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Auth from "./pages/auth/Auth.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ProductList from "./pages/products/ProductList.jsx";
import ProductDetail from "./pages/products/ProductDetail.jsx";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

