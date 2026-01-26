import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/checkout.css";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { addOrder, updateStock } = useContext(ProductContext); // Lấy hàm từ context
  const { user } = useContext(AuthContext); // Lấy user
  
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const navigate = useNavigate();

  // Nếu chưa có user (đang load hoặc chưa đăng nhập), hiện màn hình chờ hoặc chuyển về login
  useEffect(() => {
    // Nếu load xong mà không có user thì đá về login
    if (user === null && localStorage.getItem("currentUser") === null) {
      toast.error("Tài khoản không tồn tại");
    }
  }, [user, navigate]);

  // Nếu User chưa tải xong, hiển thị loading thay vì crash trang
  if (!user) {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h3>Đang tải thông tin khách hàng...</h3>
        </div>
    );
  }

  const selectedItems = cartItems.filter((item) => item.selected);
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirm = async () => {
    if (selectedItems.length === 0) {
      toast.error("Không có sản phẩm nào để thanh toán");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.warning("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }
    
    try {
      // Tạo object đơn hàng khớp với Backend Schema
      const order = {
        user: user.username, // Lấy tên từ user đã đăng nhập
        customerInfo: customerInfo,
        items: selectedItems,
        total: totalAmount,
        method: paymentMethod,
        status: "Đang xử lý",
        date: new Date().toLocaleString()
      };
      
      // 1. GỌI API TẠO ĐƠN HÀNG (Chờ cho xong)
      await addOrder(order);
      
      // 2. GỌI API TRỪ KHO (Chờ cho xong)
      // Lưu ý: Hàm này sẽ gọi API update từng sản phẩm
      await updateStock(selectedItems, 'subtract');

      // 3. Xóa giỏ hàng & Chuyển trang
      clearCart();
      toast.success("Đặt hàng thành công!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  };

  if (selectedItems.length === 0) return <div className="checkout_empty">Chưa chọn sản phẩm nào để thanh toán</div>;

  return (
    <div className="checkout_page_container">
      <h2 className="checkout_title">Thanh Toán</h2>

      <div className="checkout_section">
        <h3>Thông tin giao hàng</h3>
        <div className="checkout_input_group">
          <label>Họ tên người nhận:</label>
          <input 
            className="checkout_input"
            type="text" 
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div className="checkout_input_group">
          <label>Số điện thoại:</label>
          <input 
            className="checkout_input"
            type="text" 
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            placeholder="09xx..."
          />
        </div>
        <div className="checkout_input_group">
          <label>Địa chỉ nhận hàng:</label>
          <input 
            className="checkout_input"
            type="text" 
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
            placeholder="Số nhà, đường, quận/huyện..."
          />
        </div>
      </div>

      <div className="checkout_order_summary">
        {selectedItems.map((item) => (
          <div key={item.id} className="checkout_item_row">
            <span>{item.name} (x{item.quantity})</span>
            <span>{(item.price * item.quantity).toLocaleString()} VND</span>
          </div>
        ))}
        <div className="checkout_total_row">
          <strong>Tổng tiền:</strong>
          <strong>{totalAmount.toLocaleString()} VND</strong>
        </div>
      </div>

      <div className="checkout_payment_method">
        <label>Phương thức thanh toán:</label>
        <select 
          className="checkout_payment_select"
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="BANK">Chuyển khoản ngân hàng</option>
        </select>

        {paymentMethod === "BANK" && (
          <div className="checkout_qr_section">
            <p>Quét mã để thanh toán:</p>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
              alt="QR Code Payment" 
              className="checkout_qr_image"
            />
            <p className="checkout_bank_note">Nội dung: <strong>{user.username} {customerInfo.phone}</strong></p>
          </div>
        )}
      </div>

      <button className="checkout_confirm_button" onClick={handleConfirm}>
        Xác nhận đặt hàng
      </button>
    </div>
  );
};

export default Checkout;