import React, { useContext, useState, useEffect } from 'react';
import './CSS/Profile.css';
import { ShopContext } from '../Contexts/ShopContext';
import OrderCard from '../Components/OrderCard/OrderCard';

const Profile = () => {
  const [selectedSection, setSelectedSection] = useState('overview');
  let user = localStorage.getItem("user");
  const [newName, setNewName] = useState(user.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  user = JSON.parse(user);
  
  const [orders, setOrders] = useState([]);
  const { getProductRequest } = useContext(ShopContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.myOrders) return;

      const allOrders = [];

      for (const orderId of user.myOrders) {
        const orderData = await getProductRequest(orderId);
        if (orderData) {
          allOrders.push(orderData);
        }
      }

      setOrders(allOrders);
    //   console.log(orders[0].fullName);
      
    };

    fetchOrders();
  }, [user,getProductRequest]);

  if (!user) return <p>Loading...</p>;

  const renderSection = () => {
    switch (selectedSection) {
      case 'overview':
        return (
          <div className="profile-section">
            <h2>Welcome, {(!user.name || user.name.length === 0) ? 'edit' : user.userId}</h2>
            <p>Email: {user.email}</p>
            <p>Member since: January 2024</p>
          </div>
        );

      case 'orders':
        return (
          <div className="profile-section">
            <h2>Previous Orders</h2>
            <ul>
              {/* <li>Order #12345 – ₹1,200 – Delivered</li>
              <li>Order #12346 – ₹2,500 – In Transit</li>
              <li>Order #12347 – ₹999 – Cancelled</li> */}
            </ul>
          </div>
        );

      case 'myOrders':
        return (
          <div className="profile-section">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
              <p>You have no orders yet.</p>
            ) : (
              <div>
                {orders.map((pro, index) => (
                  <OrderCard
                    key={index}
                    order={pro}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'cart':
        return (
          <div className="profile-section">
            <h2>Your Cart</h2>
            <p>You have 3 items in your cart.</p>
          </div>
        );

      case 'settings':
        

        const token = user.token || localStorage.getItem("token");

        const handleUpdateName = async () => {
          try {
            const res = await fetch('/api/users/update-name', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name: newName }),
            });

            const data = await res.json();
            if (res.ok) {
              const updatedUser = { ...user, name: newName };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              alert('Name updated!');
              window.location.reload();
            } else {
              alert(data.message || 'Failed to update name');
            }
          } catch (err) {
            console.error(err);
            alert('Something went wrong!');
          }
        };

        const handleUpdatePassword = async () => {
          if (!newPassword || newPassword.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
          }

          try {
            const res = await fetch('/api/users/change-password', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ password: newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
              alert('Password updated!');
              setNewPassword('');
            } else {
              alert(data.message || 'Failed to update password');
            }
          } catch (err) {
            console.error(err);
            alert('Something went wrong!');
          }
        };

        const handleDeleteAccount = async () => {
          try {
            const res = await fetch('/api/users/delete', {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.ok) {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              alert('Account deleted. Logging out...');
              window.location.href = '/';
            } else {
              const data = await res.json();
              alert(data.message || 'Failed to delete account');
            }
          } catch (err) {
            console.error(err);
            alert('Something went wrong!');
          }
        };

        return (
          <div className="profile-section">
            <h2>Account Settings</h2>

            {/* Name Update */}
            <div className="settings-group">
              <h4>Update Name</h4>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleUpdateName}>Save Name</button>
            </div>

            {/* Password Update */}
            <div className="settings-group">
              <h4>Change Password</h4>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
              <button onClick={handleUpdatePassword}>Update Password</button>
            </div>

            {/* Delete Account */}
            <div className="settings-group">
              <h4>Delete Account</h4>
              {confirmDelete ? (
                <div>
                  <p>Are you sure? This cannot be undone.</p>
                  <button onClick={handleDeleteAccount}>Yes, Delete</button>
                  <button onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)}>Delete Account</button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random`}
            alt="Profile Avatar"
          />
          <h3>{(!user.name || user.name.length === 0) ? 'edit' : user.name}</h3>
        </div>
        <ul className="profile-menu">
          <li onClick={() => setSelectedSection('overview')}>Profile Overview</li>
          <li onClick={() => setSelectedSection('orders')}>Previous Orders</li>
          <li onClick={() => setSelectedSection('myOrders')}>My Orders</li>
          <li onClick={() => setSelectedSection('cart')}>Cart</li>
          <li onClick={() => setSelectedSection('settings')}>Settings</li>
        </ul>
      </div>
      <div className="profile-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default Profile;
