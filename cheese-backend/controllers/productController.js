const Product = require('../models/Product');

// 1. Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Lấy 1 sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Thêm sản phẩm mới (Create) 
exports.createProduct = async (req, res) => {
    try {
        // Lấy đầy đủ các trường từ Admin gửi lên
        const { name, price, image, category, description, size, quantity } = req.body;

        const newProduct = new Product({
            name,
            price,
            image,
            category: category || "",      
            description: description || "",
            size: size ,       
            quantity: quantity ? Number(quantity) : 0 
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 4. Cập nhật sản phẩm (Update)
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, // Tự động cập nhật mọi trường (bao gồm cả quantity nếu có sửa)
            { new: true } // Trả về data mới sau khi update
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 5. Xóa sản phẩm (Delete)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Đã xóa sản phẩm thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};