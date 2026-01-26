import { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient"; 
import { toast } from "react-toastify";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // --- HÀM LOAD DỮ LIỆU TỪ DB ---
  const loadProducts = async () => {
    try {
      const data = await axiosClient.get("/products");
      
      const formatted = data.map(item => ({ ...item, id: item._id || item.id }));
      setProducts(formatted);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    }
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id || p._id === id);
  };
  
  const loadOrders = async () => {
    try {
      const data = await axiosClient.get("/orders");
      const formatted = data.map(item => ({ ...item, id: item._id || item.id }));
      setOrders(formatted.reverse()); 
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // --- LOGIC SẢN PHẨM ---
  const addProduct = async (newProduct) => {
    try {
      await axiosClient.post("/products", newProduct);
      loadProducts();
      return true;
    } catch (error) {
      toast.error("Lỗi thêm sản phẩm");
      return false;
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const id = updatedProduct._id || updatedProduct.id;
      await axiosClient.put(`/products/${id}`, updatedProduct);
      loadProducts();
      return true;
    } catch (error) {
      toast.error("Lỗi cập nhật sản phẩm");
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axiosClient.delete(`/products/${id}`);
      loadProducts();
      return true;
    } catch (error) {
      toast.error("Lỗi xóa sản phẩm");
      return false;
    }
  };

  // --- LOGIC ĐƠN HÀNG ---
  const addOrder = async (orderData) => {
    try {
      await axiosClient.post("/orders", orderData);
      await loadOrders(); // Reload danh sách đơn
      return true;
    } catch (error) {
      console.error(error);
      throw error; // Ném lỗi để Checkout bắt được
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/orders/${orderId}`, { status: newStatus });
      loadOrders();
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  // --- QUAN TRỌNG: TRỪ KHO TRONG DB ---
  const updateStock = async (items, operation) => {
    try {
      // Duyệt qua từng sản phẩm trong giỏ để update lên server
      const promises = items.map(async (item) => {
        const currentProduct = products.find(p => p.id === item.id);
        
        if (currentProduct) {
           let newQty = currentProduct.quantity;
           if (operation === 'subtract') newQty -= item.quantity;
           if (operation === 'add') newQty += item.quantity; // Dùng khi hủy đơn
           
           // Gửi API update
           await axiosClient.put(`/products/${currentProduct.id || currentProduct._id}`, {
             ...currentProduct,
             quantity: Math.max(0, newQty)
           });
        }
      });
      
      await Promise.all(promises); // Chờ tất cả update xong
      loadProducts(); // Tải lại danh sách sản phẩm mới nhất
    } catch (error) {
      console.error("Lỗi cập nhật kho:", error);
    }
  };

  return (
    <ProductContext.Provider value={{
      products, orders,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus, updateStock
    }}>
      {children}
    </ProductContext.Provider>
  );
};