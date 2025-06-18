import React from 'react';
import './Footer.css';
import footerLogo from '../Assets/logo_big.png';
import insta_icon from '../Assets/instagram_icon.png';
import pinterest_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';


const Footer = () => {
  return (
    <div className='footer'>
       <div className="footer-logo">
            <img src={footerLogo} alt="" />
            <p>FashionZen</p>
       </div>
       <div className="footer-links">
            <ul>
                <li>Company</li>
                <li>Products</li>
                <li>Offices</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
       </div>
       <div className="footer-social-icon">
            <div className="footer-icons-container">
                <img src={insta_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={pinterest_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={whatsapp_icon} alt="" />
            </div>
        </div>
       <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2025 - All Rights Reserved</p>
        </div> 
    </div>
  )
}

export default Footer