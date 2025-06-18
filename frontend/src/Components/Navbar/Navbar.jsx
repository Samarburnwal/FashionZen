import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Contexts/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?query=${searchQuery}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Search Overlay ABOVE Navbar */}
      {showSearch && (
        <div className="nav-search-overlay">
          <form className="nav-search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
              autoFocus
            />
            <button type="submit" className="nav-search-submit">Search</button>
            <button
              type="button"
              className="nav-search-close"
              onClick={() => setShowSearch(false)}
            >
              ✖
            </button>
          </form>
        </div>
      )}

      {/* Navbar */}
      <div className='navbar'>
        <div onClick={() => navigate('/')} className='nav-logo'>
          <img src={logo} alt='logo' />
          <p>FashionZen</p>
        </div>

        <ul className='nav-menu'>
          <li onClick={() => setMenu("shop")}>
            <Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>
            {menu === "shop" && <hr />}
          </li>
          <li onClick={() => setMenu("men")}>
            <Link style={{ textDecoration: 'none' }} to='/mens'>Men</Link>
            {menu === "men" && <hr />}
          </li>
          <li onClick={() => setMenu("women")}>
            <Link style={{ textDecoration: 'none' }} to='/womens'>Women</Link>
            {menu === "women" && <hr />}
          </li>
          <li onClick={() => setMenu("kids")}>
            <Link style={{ textDecoration: 'none' }} to='/kids'>Kids</Link>
            {menu === "kids" && <hr />}
          </li>
        </ul>

        <div className='nav-login-cart'>
          {/* Search Icon */}
          <span
            onClick={() => setShowSearch(true)}
            className="nav-search-icon"
            role="button"
            title="Search"
          >
            🔍
          </span>

          {/* Login / Logout */}
          {localStorage.getItem('auth-token') ? (
            <button onClick={() => {
              localStorage.removeItem('auth-token');
              window.location.replace("/");
            }}>
              Logout
            </button>
          ) : (
            <Link to='/login'><button>Login</button></Link>
          )}

          {/* Cart */}
          <Link to='/cart'>
            <img src={cart_icon} alt="Cart" />
          </Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>

          {/* Profile */}
          <Link to='/profile'>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="nav-profile-icon"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
