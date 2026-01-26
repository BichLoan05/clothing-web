import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import { ProductContext } from "./ProductContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);
  const { products } = useContext(ProductContext);

  // --- Load/Save Cart Logic (Giữ nguyên) ---
  useEffect(() => {
    if (user && user.username) {
      const savedCart = localStorage.getItem(`cart_${user.username}`);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCartItems([]);
    }
  }, [user]);

  const saveToStorage = (items) => {
    if (user && user.username) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(items));
    }
  };

  // --- HÀM Lấy số lượng tồn kho từ ProductContext ---
  const getProductStock = (id) => {
    const product = products.find((p) => p.id === id);
    return product ? product.quantity : 0;
  };

  // --- HÀM ADD TO CART ---
  const addToCart = (product) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để mua hàng");
      return;
    }

    const currentStock = getProductStock(product.id);
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    
    // (Thắm) Kiểm tra tồn kho 
    if (currentQtyInCart + 1 > currentStock) {
      toast.error('Sản phẩm này đã hết hàng');
      return;
    }
    
    let newCart;
    if (existingItem) {
      newCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      toast.success("Đã tăng số lượng sản phẩm trong giỏ!");
    } else {
      newCart = [...cartItems, { ...product, quantity: 1, selected: false }];
      toast.success("Đã thêm vào giỏ!");
    }
    
    setCartItems(newCart);
    saveToStorage(newCart);
  };

  // --- Xóa sản phẩm khỏi giỏ ---
  const removeFromCart = (productId) => {
    const newCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(newCart);
    saveToStorage(newCart);
    toast.info("Đã xóa sản phẩm");
  };

  // --- Cập nhật số lượng (+ / -) ---
  const updateItemQuantity = (productId, amount) => {
    if (!user) return;

    const currentStock = getProductStock(productId);
    const itemInCart = cartItems.find(item => item.id === productId);

    // Nếu đang muốn tăng số lượng
    if (amount > 0) {
      if (itemInCart.quantity + amount > currentStock) {
        toast.error(`Kho chỉ còn ${currentStock} sản phẩm.`);
        return;
      }
    }

    const newCart = cartItems.map((item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });

    setCartItems(newCart);
    saveToStorage(newCart);
  };

  const toggleSelect = (id) => {
    const newCart = cartItems.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCartItems(newCart);
    saveToStorage(newCart);
  };

  const clearCart = () => {
    // (MAI) --- Sửa lỗi: Chỉ clear sản phẩm đã thanh toán ---
    const remainingItems = cartItems.filter(item => !item.selected);
    
    setCartItems(remainingItems);
    saveToStorage(remainingItems);
    
    if (remainingItems.length === 0 && user && user.username) {
      localStorage.removeItem(`cart_${user.username}`);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart,      // Export hàm mới
      updateItemQuantity,  // Export hàm mới
      toggleSelect, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};