import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import "../styles/admin.css";

const CustomerAdmin = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Đổi tên hàm thành loadData cho đúng ý bạn
    const loadData = async () => {
      try {
        const usersData = await axiosClient.get("/users");
        setCustomers(usersData);

        const ordersData = await axiosClient.get("/orders");
        setOrders(ordersData);
      } catch (error) {
        console.error("Lỗi load Customer Admin:", error);
      }
    };
    
    loadData();
  }, []);

  // ... (Phần logic đếm số lượng và render giữ nguyên)
  const getOrderStats = (username, statusType) => {
    return orders.filter(order => {
      const isUser = order.user === username;
      if (statusType === "purchased") return isUser && order.status === "Thành công";
      if (statusType === "cancelled") return isUser && order.status === "Hủy";
      return false;
    }).length;
  };

  return (
    <div className="admin_page_container">
      <div className="admin_content_full">
        <h2>Quản lý khách hàng</h2>
        <div className="total_members_badge">
          Tổng cộng: <strong>{customers.length}</strong> thành viên
        </div>
        
        <table className="admin_table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên đăng nhập</th>
              <th>Ngày tạo</th>
              <th>Vai trò</th>
              <th>Đã mua</th>
              <th>Đã hủy</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, index) => {
              const purchasedCount = getOrderStats(cust.username, "purchased");
              const cancelledCount = getOrderStats(cust.username, "cancelled");

              return (
                <tr key={cust._id || index}>
                  <td>{index + 1}</td>
                  <td><strong>{cust.username}</strong></td>
                  <td>{cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td>{cust.role || "user"}</td>
                  <td className="count_purchased">{purchasedCount}</td>
                  <td className="count_cancelled">{cancelledCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerAdmin;