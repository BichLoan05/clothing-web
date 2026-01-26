// import React from "react";
import { FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  const FbLink = "https://www.facebook.com/"; 
  const InsLink = "https://www.instagram.com/";

  return (
    <footer className="footer_container">
      <div className="footer_content">
        
        {/* Gom tất cả vào 1 lưới (Grid) để thẳng hàng thẳng lối */}
        <div className="footer_info_grid">
          
          {/* 1. Phone */}
          <div className="footer_item">
            <FaPhoneAlt className="footer_icon" /> 
            <span>0999 999 999</span>
          </div>

          {/* 2. Email */}
          <div className="footer_item">
            <FaEnvelope className="footer_icon" /> 
            <span>cheese_clothing@gmail.com</span>
          </div>

          {/* 3. Facebook */}
          <a href={FbLink} target="_blank" rel="noreferrer" className="footer_item footer_link">
            <FaFacebook className="footer_icon" />
            <span>cheese clothing</span>
          </a>

          {/* 4. Instagram */}
          <a href={InsLink} target="_blank" rel="noreferrer" className="footer_item footer_link">
            <FaInstagram className="footer_icon" />
            <span>cheese_clothing25</span>
          </a>

        </div>

        {/* Copyright */}
        <p className="footer_copyright">Copyright &copy; Cheese Clothing</p>
      </div>
    </footer>
  );
};

export default Footer;