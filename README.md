
# 👕 Clothing Web

Clothing Web là một website bán quần áo được xây dựng theo mô hình Fullstack MERN, cho phép người dùng mua sắm trực tuyến và cung cấp trang quản trị riêng cho Admin để quản lý hệ thống.

# 🎯 Mục Tiêu Dự Án

- Xây dựng website bán quần áo hoạt động đầy đủ từ Frontend đến Backend

- Áp dụng kiến thức ReactJS, Node.js, MongoDB

- Thực hiện CRUD sản phẩm – đơn hàng – người dùng

- Phân quyền User / Admin

- Rèn luyện kỹ năng xây dựng API RESTful

# 🛠️ Công Nghệ Sử Dụng

## 🔹 Frontend

ReactJS (Vite)

Axios (gọi API)

Context API

- AuthContext 

- CartContext 

- ProductContext 

CSS 

## 🔹 Backend

- Node.js

- Express.js

- MongoDB + Mongoose

- JWT Authentication

- dotenv

# 🚀 Cách Chạy Dự Án
## ✅ Yêu Cầu

- Đã cài Node.js

- Đã cài MongoDB (Local hoặc MongoDB Atlas)

## 💻 CÁCH 1: Chạy Thủ Công (Khuyên dùng khi phát triển)
### 🔹 Bước 1: Clone Project
```
git clone https://github.com/....../clothing-web.git
cd clothing-web
```
## 🔹 Bước 2: Cài đặt & Chạy Backend
```
cd cheese-backend
npm install
```

## Tạo file .env trong thư mục cheese-backend
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/clothing_web
JWT_SECRET=clothing_secret
```

## Chạy server
```
npm start

# hoặc

node server.js
```

## 👉 Backend chạy tại:
http://localhost:5000

## 🔹 Bước 3: Cài đặt & Chạy Frontend

Mở terminal mới:
```
cd cheese-clothing
npm install
npm run dev
```

## 👉 Frontend chạy tại (thường là):
http://localhost:5173

# ✨ Chức Năng Chính

## 👤 Người Dùng

Bước 1: Người dùng truy cập website
       
Bước 2: Đăng ký / Đăng nhập tài khoản

Bước 3: Xem danh sách sản phẩm
            
Bước 4: Xem chi tiết sản phẩm

Bước 5: Thêm sản phẩm vào giỏ hàng
            
Bước 6: Thực hiện đặt hàng
            
Bước 7: Hệ thống lưu đơn hàng vào cơ sở dữ liệu
            
Bước 8: Người dùng xem lịch sử đơn hàng

### 👉 Lưu ý: Người dùng chỉ có thể đặt hàng khi đã đăng nhập.

## 🔐 Admin

Bước 1: Admin đăng nhập hệ thống

Bước 2: Hệ thống kiểm tra quyền Admin (JWT + role)

Bước 3: Truy cập trang quản trị

Bước 4: Thực hiện các chức năng:

- Quản lý sản phẩm (Thêm / Sửa / Xóa)

- Xem danh sách đơn hàng

- Cập nhật trạng thái đơn hàng

- Xem danh sách người dùng

Bước 5: Dữ liệu được cập nhật vào MongoDB và phản hồi về Frontend

## 🔑 Phân Quyền Người Dùng
```
Vai trò	     Quyền
User         Mua hàng, đặt đơn
Admin	     Quản lý toàn bộ hệ thống
```

## 📂 Cấu Trúc Thư Mục
```
clothing-web/
├── cheese-backend/              # Backend Node.js + Express
│   ├── controllers/             # Xử lý logic (auth, product, order)
│   ├── models/                  # Schema MongoDB (User, Product, Order)
│   ├── routes/                  # Định nghĩa API
│   ├── middleware/              # Auth, phân quyền
│   ├── .env                     # Biến môi trường
│   ├── server.js                # File khởi động server
│   └── package.json
│
├── cheese-clothing/             # Frontend React (Vite)
│   ├── public/                  # Ảnh, logo
│   ├── src/
│   │   ├── api/                 # axiosClient
│   │   ├── assets/              # Ảnh, icon
│   │   ├── components/          # Navbar, Footer, ProductCard...
│   │   ├── context/             # AuthContext, CartContext, ProductContext
│   │   ├── pages/               # Home, Login, Register, Admin, Cart...
│   │   ├── styles/              # CSS
│   │   ├── App.jsx
│   │   └── main.jsx
├── └── package.json
```
