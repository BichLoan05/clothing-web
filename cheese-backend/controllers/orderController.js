const Order = require('../models/Order');
// 1. Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
    try {
        const { 
            shippingInfo, 
            orderItems, 
            totalPrice 
        } = req.body;

        const order = await Order.create({
            shippingInfo,
            orderItems,
            totalPrice,
            user: req.user.id, 
            paidAt: Date.now(),
        });

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 2. Lấy danh sách toàn bộ đơn hàng (Dành cho Admin)
exports.getAllOrders = async (req, res) => {
    try {
        // Sắp xếp đơn mới nhất lên đầu (.sort)
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Cập nhật trạng thái đơn hàng (Admin)
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        order.orderStatus = req.body.status;

        // Nếu giao thành công thì cập nhật ngày giao
        if (req.body.status === "Thành công") {
            order.deliveredAt = Date.now();
        }

        await order.save();
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy đơn hàng của người dùng đang đăng nhập
exports.myOrders = async (req, res) => {
    try {
        // Tìm các đơn hàng có trường 'user' trùng với ID người đang request
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};