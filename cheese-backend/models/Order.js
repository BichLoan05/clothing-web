const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Tên người đặt
  customerInfo: {
    name: String,
    phone: String,
    address: String
  },
  items: [
    {
      id: String, // ID sản phẩm
      name: String,
      price: Number,
      quantity: Number,
      size: String,
      image: String
    }
  ],
  total: { type: Number, required: true },
  method: { type: String, default: "COD" },
  status: { type: String, default: "Đang xử lý" },
  date: { type: String, default: () => new Date().toLocaleString() } // Lưu dạng string cho dễ đọc như frontend cũ
});

module.exports = mongoose.model("Order", OrderSchema);