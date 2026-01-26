import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify"; 
import { FaShoppingCart, FaUser, FaCaretDown, FaSignOutAlt } from "react-icons/fa";
import "../styles/navbar.css";



const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeDropdown = () => setActiveDropdown(null);

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "active" : "";

  // ================= ADMIN NAVBAR =================
  if (user?.role === "admin") {
    return (
      <nav className="navbar_container">
        <div className="navbar_content">
          <div className="navbar_left">
            <Link to="/admin" className="navbar_brand">
              <img className="navbar_logo" src="web_logo 1.png" alt="logo" />
            </Link>

            <div className="navbar_nav_list">
              <Link to="/admin/products" 
              className={`nav_item_link ${isActive("/admin/products")}`}>Sản phẩm</Link>
              
              <Link to="/admin/orders"
              className={`nav_item_link ${isActive("/admin/orders")}`}>Đơn hàng</Link>
              
              <Link to="/admin/customers"
              className={`nav_item_link ${isActive("/admin/customers")}`}>Quản lý KH</Link>
            </div>
          </div>

          <div className="navbar_right">
            <div className="dropdown_wrapper" onClick={() => toggleDropdown("admin_user")}
            >
              <span className={`nav_item_link ${
                  activeDropdown === "admin_user" ? "active" : ""
                }`}>
                <FaUser className="icon_small" /> {user.username}{" "}
                <FaCaretDown className="icon_tiny" />
              </span>

              {activeDropdown === "admin_user" && (
                <div className="dropdown_menu dropdown_menu_right fade_in">
                  <button onClick={handleLogout} className="dropdown_item text_danger">
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );}

  // ================= USER NAVBAR =================
  const handleCartClick = () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để xem giỏ hàng!");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <nav className="navbar_container">
      <div className="navbar_content">
        <div className="navbar_left">
          <Link to="/" className="navbar_brand">
            <img className="navbar_logo" src="web_logo 1.png" alt="logo" />
          </Link>

          <div className="navbar_nav_list">
            <Link
              to="/"
              className={`nav_item_link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              Trang chủ
            </Link>

            <div
              className="dropdown_wrapper"
              onClick={() => toggleDropdown("shop")}
            >
              <span
                className={`nav_item_link ${
                  activeDropdown === "shop" ? "active" : ""
                }`}
              >
                Sản phẩm <FaCaretDown className="icon_tiny" />
              </span>

              {activeDropdown === "shop" && (
                <div className="dropdown_menu fade_in">
                  <Link
                    to="/"
                    className="dropdown_item"
                    onClick={closeDropdown}
                  >
                    Tất cả sản phẩm
                  </Link>
                  <div className="dropdown_divider"></div>
                  <Link
                    to="/?search= Xuân Hạ"
                    className="dropdown_item"
                    onClick={closeDropdown}
                  >
                    BST Xuân Hạ 
                  </Link>
                  <Link
                    to="/?search= Thu Đông"
                    className="dropdown_item"
                    onClick={closeDropdown}
                  >
                    BST Thu Đông
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="navbar_right">
          <div
            className="nav_cart_btn"
            onClick={handleCartClick}
            style={{ cursor: "pointer" }}
          >
            <FaShoppingCart />
            <span>Giỏ hàng</span>
            <span className="cart_badge">{cartCount}</span>
          </div>

          <div
            className="dropdown_wrapper"
            onClick={() => toggleDropdown("user")}
          >
            <span
              className={`nav_item_link ${
                activeDropdown === "user" ? "active" : ""
              }`}
            >
              <FaUser className="icon_small" />{" "}
              {user ? user.username : "Tài khoản"}{" "}
              <FaCaretDown className="icon_tiny" />
            </span>

            {activeDropdown === "user" && (
              <div className="dropdown_menu dropdown_menu_right fade_in">
                {user ? (
                  <>
                    <div className="dropdown_header">
                      Xin chào, {user.username}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="dropdown_item text_danger"
                    >
                      <FaSignOutAlt /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="dropdown_item"
                      onClick={closeDropdown}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/signup"
                      className="dropdown_item"
                      onClick={closeDropdown}
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
