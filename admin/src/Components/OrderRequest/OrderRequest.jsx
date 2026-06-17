import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderRequest.css'; // Import the CSS file

const URL = process.env.BackendURL;

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OrderRequest = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/getAllOrders`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`${URL}/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o));
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  return (
    <div className="order-container">
      <h1 className="order-heading">All Orders</h1>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="order-grid">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-info">
                <h2>{order.fullName}</h2>
                <p className="email">{order.email}</p>
                <p><strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.zipCode}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                {order.paymentMethod === 'card' && (
                  <p><strong>Card:</strong> **** **** **** {order.cardDetails?.cardNumber?.slice(-4)}</p>
                )}
                {order.paymentMethod === 'upi' && (
                  <p><strong>UPI ID:</strong> {order.upiId}</p>
                )}
              </div>

              <div className="status-section">
                <label>Order Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="items-section">
                <h4>Items:</h4>
                <ul>
                  {order.cartItems.map((item, index) => (
                    <li key={index}>{item.name || 'Unnamed Item'} (x{item.quantity || 1})</li>
                  ))}
                </ul>
              </div>

              <div className="footer-section">
                <p><strong>Total Price:</strong> ₹{order.price}</p>
                <p className="timestamp">Ordered At: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderRequest;
