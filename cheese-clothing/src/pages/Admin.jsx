import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom"; 
import { toast } from "react-toastify";
import "../styles/admin.css";

const Admin = () => {
  const { user } = useContext(AuthContext);
  // Lấy updateStock
  const { products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus, updateStock } = useContext(ProductContext);
  const navigate = useNavigate();
  const location = useLocation(); 

  const isOrdersPage = location.pathname.includes("/orders");

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "", price: "", quantity: "", size: "", image: "", description: ""
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusOrder, setStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const effectiveUser = user || storedUser;

    if (!effectiveUser || effectiveUser.role !== "admin") {
      toast.error("Bạn không có quyền truy cập trang này");
      navigate("/");
    }
  }, [user, navigate]);

  // --- LOGIC SẢN PHẨM ---
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", quantity: "", size: "", image: "", description: "" });
    setShowProductModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      deleteProduct(id);
      toast.success("Đã xóa sản phẩm");
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.quantity || 
      !productForm.size || !productForm.image) {
      toast.warning("Vui lòng nhập đủ thông tin bắt buộc");
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      quantity: Number(productForm.quantity)
    };

    if (editingProduct) {
      updateProduct(payload);
      toast.success("Cập nhật thành công");
    } else {
      addProduct(payload);
      toast.success("Thêm mới thành công");
    }
    setShowProductModal(false);
  };

  // --- LOGIC THỐNG KÊ ---
  const statTotalOrders = orders.length;
  const statSuccessOrders = orders.filter(o => o.status === "Thành công").length;
  const statProcessingOrders = orders.filter(o => !o.status || o.status === "Đang xử lý" || o.status === "Đang vận chuyển").length;
  const statCancelledOrders = orders.filter(o => o.status === "Hủy").length;
  const statSalesVolume = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const statRevenue = orders.reduce((sum, order) => {
    return order.status === "Thành công" ? sum + Number(order.total) : sum;
  }, 0);


  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleOpenUpdateStatus = (order) => {
    setStatusOrder(order);
    setNewStatus(order.status || "Đang xử lý");
    setShowStatusModal(true);
  };

  // --- XỬ LÝ CẬP NHẬT TRẠNG THÁI & HOÀN KHO ---
  const handleUpdateStatusSubmit = () => {
    if (statusOrder) {
      // Logic hoàn kho: Nếu chuyển sang "Hủy" VÀ trạng thái cũ chưa phải là "Hủy"
      if (newStatus === "Hủy" && statusOrder.status !== "Hủy") {
        // updateStock(statusOrder.items, 'add'); // Cộng lại kho
      }
      
      // Lưu ý: Nếu muốn xử lý ngược lại (từ Hủy -> Đang xử lý thì trừ kho) thì thêm logic ở đây.
      // Nhưng đề bài chỉ yêu cầu "Hủy đơn -> cộng lại".

      updateOrderStatus(statusOrder.id, newStatus);
      toast.success(`Đã cập nhật đơn hàng #${statusOrder.id} sang: ${newStatus}`);
      setShowStatusModal(false);
    }
  };

  return (
    <div className="admin_page_container">
      <div className="admin_content_full">
        {/* --- ROUTE SẢN PHẨM --- */}
        {!isOrdersPage && (
          <div className="admin_products_section">
            <div className="admin_section_header">
              <h2>Danh sách sản phẩm</h2>
              <button className="admin_add_btn" onClick={handleOpenAdd}>+ Thêm sản phẩm</button>
            </div>
            <table className="admin_table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Kho</th>
                  <th>Size</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><img src={p.image} alt="" className="admin_thumb_img"/></td>
                    <td>{p.name}</td>
                    <td>{p.price.toLocaleString()} đ</td>
                    <td>{p.quantity}</td>
                    <td>{p.size}</td>
                    <td>
                      <button className="admin_action_btn edit" onClick={() => handleOpenEdit(p)}>Cập nhật</button>
                      <button className="admin_action_btn delete" onClick={() => handleDelete(p.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- ROUTE ĐƠN HÀNG --- */}
        {isOrdersPage && (
          <div className="admin_orders_section">
            {/* THỐNG KÊ */}
            <div className="admin_stats_row">
              <div className="admin_stat_card">
                <h3>Tổng đơn hàng</h3>
                <p>{statTotalOrders}</p>
              </div>
              <div className="admin_stat_card">
                <h3>Đơn thành công</h3>
                <p style={{color: 'green'}}>{statSuccessOrders}</p>
              </div>
              <div className="admin_stat_card">
                <h3>Đang xử lý/VC</h3>
                <p style={{color: 'orange'}}>{statProcessingOrders}</p>
              </div>
              <div className="admin_stat_card">
                <h3>Đơn hủy</h3>
                <p style={{color: 'red'}}>{statCancelledOrders}</p>
              </div>
              <div className="admin_stat_card">
                <h3>Doanh số</h3>
                <p>{statSalesVolume.toLocaleString()} đ</p>
              </div>
              <div className="admin_stat_card">
                <h3>Doanh thu</h3>
                <p style={{color: '#0d6efd'}}>{statRevenue.toLocaleString()} đ</p>
              </div>
            </div>
            
            <table className="admin_table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user}</td>
                    <td>{Number(order.total).toLocaleString()} vnđ</td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: order.status === 'Hủy' ? 'red' : order.status === 'Thành công' ? 'green' : 'orange' 
                      }}>
                        {order.status || "Đang xử lý"}
                      </span>
                    </td>
                    <td>
                      <button className="admin_action_btn view" onClick={() => handleViewOrder(order)}>Xem</button>
                      <button className="admin_action_btn edit" onClick={() => handleOpenUpdateStatus(order)}>Cập nhật</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CÁC MODAL --- */}
      {showProductModal && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h3>{editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h3>
            <form onSubmit={handleProductSubmit} className="admin_modal_form">
              <input placeholder="Tên sản phẩm (*)" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="modal_input"/>
              <div className="modal_row_inputs">
                <input type="number" placeholder="Giá (*)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="modal_input"/>
                <input type="number" placeholder="Số lượng (*)" value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: e.target.value})} className="modal_input"/>
                <select 
                  value={productForm.size} 
                  onChange={e => setProductForm({...productForm, size: e.target.value})} 
                  className="modal_input"
                >
                  <option value="">Chọn Size (*)</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <input placeholder="Link ảnh (*)" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="modal_input"/>
              <textarea placeholder="Mô tả" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="modal_textarea"></textarea>
              <div className="modal_actions">
                <button type="button" onClick={() => setShowProductModal(false)} className="modal_cancel_btn">Hủy</button>
                <button type="submit" className="modal_submit_btn">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showOrderModal && selectedOrder && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
            <br/>
            <p><strong>Tài khoản đặt: </strong> {selectedOrder.user}</p>
            {selectedOrder.customerInfo ? (
              <>
                 <p><strong>Người nhận: </strong> {selectedOrder.customerInfo.name}</p>
                 <p><strong>Số điện thoại: </strong> {selectedOrder.customerInfo.phone}</p>
                 <p><strong>Địa chỉ: </strong> {selectedOrder.customerInfo.address}</p>
              </>
            ) : (
              <p><em>(Đơn hàng cũ chưa có thông tin chi tiết)</em></p>
            )}
            <p><strong>Ngày đặt: </strong> {selectedOrder.date}</p>
            <p><strong>Trạng thái: </strong> {selectedOrder.status || "Đang xử lý"}</p>
            <p><strong>Thanh toán: </strong> {selectedOrder.method === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'}</p>
            <br/>
            <div className="admin_order_items_list">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="admin_order_item_detail">
                  <p><strong>Sản phẩm: </strong></p>
                  <span>{item.name} ({item.size})</span>
                  <span> x {item.quantity}</span>
                  <span>{(Number(item.price) * Number(item.quantity)).toLocaleString()} vnđ</span>
                </div>
              ))}
            </div>
            <br/>
            <h4 className="admin_order_total">
                Tổng cộng: {selectedOrder.items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0).toLocaleString()} vnđ
            </h4>
            <button onClick={() => setShowOrderModal(false)} className="modal_close_btn">Đóng</button>
          </div>
        </div>
      )}

      {showStatusModal && statusOrder && (
        <div className="modal_overlay">
          <div className="modal_content" style={{ width: '400px' }}>
            <h3>Cập nhật trạng thái đơn #{statusOrder.id}</h3>
            <div className="admin_modal_form">
              <label><strong>Chọn trạng thái mới:</strong></label>
              <select 
                className="modal_input"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{ marginTop: '10px', marginBottom: '20px' }}
              >
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đang vận chuyển">Đang vận chuyển</option>
                <option value="Thành công">Thành công</option>
                <option value="Hủy">Hủy</option>
              </select>
              <div className="modal_actions">
                <button onClick={() => setShowStatusModal(false)} className="modal_cancel_btn">Hủy</button>
                <button onClick={handleUpdateStatusSubmit} className="modal_submit_btn">Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;