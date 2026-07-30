import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/myOrders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Unable to load orders.');
        setOrders(Array.isArray(data) ? data : []);
      } catch (requestError) {
        console.error(requestError);
        setError(requestError.message || 'Unable to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.token]);

  if (!user) {
    return (
      <div className="profile-card profile-empty">
        <h2>Please log in first</h2>
        <Link to="/login" className="btn">Login</Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <section className="profile-card">
        <div className="profile-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
        <div>
          <p className="profile-label">My Profile</p>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <p className="profile-role">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
        </div>
        <div className="profile-actions">
          <Link to="/shop" className="btn">Continue shopping</Link>
          <button type="button" className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </section>

      <section className="orders-card">
        <h2>My Orders</h2>
        {loading && <p className="orders-message">Loading orders...</p>}
        {error && <p className="orders-message orders-error">{error}</p>}
        {!loading && !error && orders.length === 0 && <p className="orders-message">You have not placed any orders yet.</p>}

        {orders.map((order) => (
          <article className="order-item" key={order._id}>
            <div className="order-heading">
              <div>
                <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <span className={`order-status status-${order.status || 'pending'}`}>{order.status || 'pending'}</span>
            </div>

            <div className="order-details">
              <div>
                <h3>Products</h3>
                {order.items?.length ? (
                  <ul className="order-products">
                    {order.items.map((item) => (
                      <li key={item._id || item.product?._id || item.product}>
                        <strong>{item.product?.name || 'Product'}</strong>
                        <span>Quantity: {item.qty} · ₹{Number(item.price).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="orders-message">Product details unavailable.</p>}
              </div>
              <div>
                <h3>Delivery Address</h3>
                <p className="order-address">
                  {[order.address?.fullName, order.address?.street, order.address?.city, order.address?.postalCode, order.address?.country]
                    .filter(Boolean)
                    .join(', ') || 'Address unavailable'}
                </p>
              </div>
            </div>

            <div className="order-footer">
              <span>Delivery status: <strong>{order.status || 'pending'}</strong></span>
              <strong>Order total: ₹{Number(order.totalAmount).toFixed(2)}</strong>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Profile;
