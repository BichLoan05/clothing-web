const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
    //  Nhận thêm email từ Frontend gửi lên
    const { username, password, email } = req.body;

    console.log("BODY POSTMAN:", req.body);

    // Kiểm tra thiếu dữ liệu
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ username, email và password" });
    }

    try {
        // Kiểm tra trùng username
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
        }

        // Hash password (Mã hóa mật khẩu)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới 
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });

        // Lưu vào MongoDB
        const savedUser = await newUser.save();
        console.log("USER SAVED:", savedUser);

        // Trả về kết quả
        res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
                createdAt: savedUser.createdAt
            }
        });
    } catch (err) {
        console.error("ERROR REGISTER:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    const { username, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!username || !password) {
        return res.status(400).json({ message: "Vui lòng nhập username và password" });
    }

    try {
        // Tìm user trong DB
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
        }

        // So sánh password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "mat_khau_bi_mat_cua_toi", 
            { expiresIn: '1d' }
        );

        console.log("LOGIN SUCCESS:", user.username);

        // Trả về token + user
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error("ERROR LOGIN:", err.message);
        res.status(500).json({ message: err.message });
    }
};