const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Models
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();

// Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Đọc được JSON từ Frontend gửi lên

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Đã kết nối MongoDB"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// 1. AUTH API (Đăng ký / Đăng nhập)

// Đăng ký
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check trùng user
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Tên tài khoản đã tồn tại" });

    const newUser = new User({ username, password });
    await newUser.save();
    
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Tài khoản này không tồn tại" });
    }

    if (user.password != password) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" })
    }
    
    // Trả về thông tin user
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 2. USERS API (Lấy danh sách KH)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. PRODUCTS API (CRUD Sản phẩm)

// Lấy tất cả
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm mới
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật (Thông tin & Số lượng tồn kho)
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Trả về data mới sau khi update
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. ORDERS API (Đơn hàng)

// Lấy danh sách đơn
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 }); // Mới nhất lên đầu
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo đơn hàng mới
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật trạng thái đơn (Duyệt, Hủy...)
app.put("/api/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CHẠY SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});