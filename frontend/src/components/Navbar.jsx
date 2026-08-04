import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import "../styles/navbar.css";

const Navbar = () => {
    const cartItems = useSelector((state) => state.cart?.cartItems || []);
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <img
                        src="/ShopNestLogo.png"
                        className="navbar-logo"
                        alt="ShopNest logo"
                    />
                    <span>ShopNest</span>
                </Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/shop">Shop</Link></li>
                <li>
                    <Link to="/cart">Cart{count > 0 && <span className="cart-badge"> {count}</span>}</Link>
                </li>
                <li><Link to="/admin">Admin</Link></li>
                {user ? (
                    <>
                        <li className="navbar-user">
                            <Link to="/profile" aria-label="Open your profile">
                                <span className="user-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                                <span>{user.name || 'Profile'}</span>
                            </Link>
                        </li>
                        <li><button type="button" className="btn-logout" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
