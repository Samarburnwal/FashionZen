import React, { useContext, useState } from 'react';
import './CSS/CheckoutPage.css';
import {jwtDecode} from 'jwt-decode';
import { ShopContext } from '../Contexts/ShopContext';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const {getCart,getTotalAmount} = useContext(ShopContext);
  const totalAmount = getTotalAmount();
  const [formData,setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });

  const cartItems = getCart();

  console.log(cartItems);

  const handleChange = (e)=>{
    const {name,value} = e.target;
    setFormData({...formData,[name]:value});
  }

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('auth-token');
    const decoded = jwtDecode(token);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      paymentMethod: paymentMethod,
      userId: decoded.user.id,
      price: totalAmount,
      cartItems: cartItems,
    };
  
    if (paymentMethod === 'card') {
      payload.cardDetails = {
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      };
    }
  
    if (paymentMethod === 'upi') {
      payload.upiId = formData.upiId;
    }

    try {
      const response = await fetch('http://localhost:4000/order-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      if (result.success) {
        setShowPopup(true);
      } else {
        alert("Order failed!");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Server error!");
    }

    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name='fullName' value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name='email' value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" name='address' value={formData.address} onChange={handleChange} required />
        </div>

        <div className="form-row three-columns">
          <div className="form-group third">
            <label>City</label>
            <input type="text" name='city' value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-group third">
            <label>State</label>
            <input type="text" name='state' value={formData.state} onChange={handleChange} required />
          </div>
          <div className="form-group third">
            <label>ZIP Code</label>
            <input type="text" name='zipCode' value={formData.zipCode} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select onChange={handlePaymentChange} required>
            <option value="">Select Payment Method</option>
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        {paymentMethod === 'card' && (
          <>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" name='cardNumber' value={formData.cardNumber} required />
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" name='expiryDate' value={formData.expiryDate} required />
              </div>
              <div className="form-group half">
                <label>CVV</label>
                <input type="text" required />
              </div>
            </div>
          </>
        )}

        {paymentMethod === 'upi' && (
          <div className="form-group">
            <label>UPI ID</label>
            <input type="text" required />
          </div>
        )}

        <button type="submit" onClick={handleSubmit}>Submit Order</button>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Order Confirmed!</h3>
            <p>Your order has been placed successfully.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
