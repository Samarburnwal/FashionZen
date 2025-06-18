import React from 'react';
import './OrderCard.css';

const OrderCard = ({order}) => {
    
  return (
    <div className="order-card">
      <h3 className="order-title">Order by: {order.fullName}</h3>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.zipCode}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

      {order.paymentMethod === 'card' && order.cardDetails && (
        <p><strong>Card:</strong> **** **** **** {order.cardDetails.cardNumber?.slice(-4)}</p>
      )}

      {order.paymentMethod === 'upi' && (
        <p><strong>UPI ID:</strong> {order.upiId}</p>
      )}

      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p className="price"><strong>Total Price:</strong> ₹{order.price}</p>

      <div className="cart-items">
        <strong>Cart Items:</strong>
        <ul>
          {order.cartItems.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity} – ₹{item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderCard;
