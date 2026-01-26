const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // 1. ng đặt hàng
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // 2. Thông tin giao hàng
    shippingInfo: {
        address: { type: String, required: true },
        phone: { type: String, required: true },
        name: { type: String, required: true }
    },
    
    // 3. Danh sách sản phẩm
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true }
        }
    ],
    
    // 4. Tổng tiền
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    
    // 5. Trạng thái đơn hàng
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing' 
    },

    // 6. Thời gian thanh toán 
    paidAt: {
        type: Date
    },

    // 7. Thời gian giao hàng thành công 
    deliveredAt: {
        type: Date
    },

    // 8. Ngày tạo đơn
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);