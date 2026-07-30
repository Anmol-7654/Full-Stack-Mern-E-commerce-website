import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import InfoPage from './pages/InfoPage';
import About from './pages/About';
import ReturnPolicy from './pages/ReturnPolicy';
import Disclaimer from './pages/Disclaimer';    
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import AdminDashboard from './admin/AdminDashboard';
import AddProduct from './admin/AddProduct';
import AdminProducts from './admin/AdminProducts';
import EditProduct from './admin/EditProduct';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';

function App() {
    return (
        <Router>
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/return" element={<ReturnPolicy />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                     <Route path="/contact" element={<InfoPage title="Contact us" description="Have questions about your order or a product suggestion? Reach out and we will be happy to help." ctaText="Go to shop" ctaLink="/shop" />} />
                    <Route path="/privacy" element={<InfoPage title="Privacy policy" description="We respect your privacy and keep your personal information secure and used only for the purpose of helping you shop better." />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/ordersuccess" element={<OrderSuccess />} />
                     <Route path="/profile" element={<Profile />} />
                     <Route path="/admin" element={<AdminDashboard />} />
                   <Route path="/admin/add-product" element={<AddProduct />} />
                   <Route path="/admin/products" element={<AdminProducts />} />
                   <Route path="/admin/edit-product/:id" element={<EditProduct />} />
                   <Route path="/admin/orders" element={<AdminOrders />} />
                   <Route path="/admin/users" element={<AdminUsers />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
