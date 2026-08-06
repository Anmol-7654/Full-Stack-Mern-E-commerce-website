import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cardSlice';
import { fetchJson } from '../api';
import '../styles/checkout.css';
const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || item.qty || 1),
    0
  );

  const isValidObjectId = (value) => typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value);

  const bypassPayment = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      if (!user?.token) {
        throw new Error('Please login before placing an order.');
      }
      const payload = {
        items: cartItems.map((item) => {
          const productId = item.id || item.productId ||
            (typeof item.product === 'string' ? item.product : item.product?._id || item.product?.id) ||
            (typeof item.productId === 'string' ? item.productId : item.productId?._id || item.productId?.id);
          if (!productId || !isValidObjectId(productId)) {
            throw new Error('Cart contains a product that is not available for ordering. Please remove placeholder products and refresh the catalog.');
          }
          const qty = Number(item.quantity ?? item.qty ?? 1);
          const price = Number(item.price ?? 0);
          if (!Number.isFinite(qty) || qty <= 0) {
            throw new Error(`Cart item quantity must be a positive number for product ${productId}.`);
          }
          if (!Number.isFinite(price) || price < 0) {
            throw new Error(`Cart item price must be a valid number for product ${productId}.`);
          }
          return {
            product: productId,
            qty,
            price
          };
        }),
        totalAmount: totalPrice,
        address,
        paymentId: 'student_bypass_' + Date.now()
      };

      await fetchJson('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      dispatch(clearCart());
      navigate('/ordersuccess');
    } catch (error) {
      const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      const errorDetails = error?.error ? `${error.error}` : '';
      console.error('Checkout order failed:', { errorMessage, errorDetails, error });
      setError((errorMessage + (errorDetails ? `: ${errorDetails}` : '')).trim() || 'Unable to create the order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    // Ensure all address fields are filled since we call preventDefault()
    const required = ['fullName', 'street', 'city', 'postalCode', 'country'];
    const missing = required.filter((k) => !address[k]);
    if (missing.length) {
      alert('Please complete the shipping address before continuing.');
      return;
    }
    bypassPayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
