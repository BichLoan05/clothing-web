import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa"; // Import icon
import "../styles/cart.css";

const Cart = () => {
  // Lấy thêm hàm updateItemQuantity và removeFromCart
  const { cartItems, toggleSelect, updateItemQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart_page_container">
      <h2 className="cart_title">Giỏ hàng của bạn</h2>
      
      {cartItems.length === 0 ? (
        /* SỬA LỖI: Bọc nội dung trống trong 1 thẻ div cha */
        <div className="cart_empty_state">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" 
              alt="Giỏ hàng trống" 
              className="cart_empty_img"
            />
            <p>Giỏ hàng trống</p>
            <button className="cart_continue_btn" onClick={() => navigate("/")}>
                Tiếp tục mua sắm
            </button>
        </div>
      ) : (
        <div className="cart_list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart_item">
              {/* Checkbox chọn mua */}
              <input
                type="checkbox"
                className="cart_item_checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(item.id)}
              />

              {/* Ảnh sản phẩm */}
              <img src={item.image} alt={item.name} className="cart_item_image" />

              {/* Thông tin & Giá */}
              <div className="cart_item_info">
                <h4>{item.name}</h4>
                <p className="cart_item_price">{item.price.toLocaleString()} VND</p>
                <p className="cart_item_size">Size: {item.size || 'Freesize'}</p>
              </div>

              {/* Bộ điều chỉnh số lượng */}
              <div className="cart_quantity_control">
                <button onClick={() => updateItemQuantity(item.id, - 1)}>
                    <FaMinus size={10} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItemQuantity(item.id, 1)}>
                    <FaPlus size={10} />
                </button>
              </div>

              {/* Nút xóa */}
              <button 
                className="cart_remove_btn" 
                onClick={() => removeFromCart(item.id)}
                title="Xóa sản phẩm"
              >
                <FaTrash />
              </button>
            </div>
          ))}

          {/* Tổng tiền tạm tính */}
          <div className="cart_footer">
             <div className="cart_total_preview">
                Tổng cộng: {cartItems.filter(i => i.selected).reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()} VND
             </div>
             <button className="cart_checkout_button" onClick={handleCheckout}>
                Tiến hành thanh toán
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;