
# I. Mô tả
Clothing Web là một website bán quần áo được xây dựng theo mô hình Fullstack MERN, cho phép người dùng mua sắm trực tuyến và cung cấp trang quản trị riêng cho Admin để quản lý hệ thống.
# II. Mục Tiêu Dự Án
- Hoàn thiện hệ thống E-commerce: Xây dựng luồng dữ liệu khép kín từ Frontend đến Backend
- Ứng dụng MERN Stack: Thực hành chuyên sâu ReactJS, Node.js, Express và MongoDB
- Bảo mật & Phân quyền: Triển khai xác thực JWT và phân tầng quyền hạn giữa Người dùng (User) và Quản trị viên (Admin)
- RESTful API: Thiết kế hệ thống API chuẩn hóa cho việc quản lý sản phẩm, đơn hàng và người dùng
# III. Công Nghệ Sử Dụng
## 1. Frontend
- Core: ReactJS (Vite)
- State Management: Context API (Quản lý Auth, Cart, Product)
- Data Fetching: Axios
- Styling: CSS Custom & Bootstrap
- UI Components: Tối ưu hóa trải nghiệm người dùng linh hoạt.
## 2. Backend
- Runtime: Node.js & Express.js       
- Database: MongoDB + Mongoose (ODM)
- Security: JWT (JSON Web Token), bcrypt cho mã hóa mật khẩu
- Environment: Dotenv quản lý cấu hình hệ thống
# IV. Hướng dẫn khởi chạy.
## Yêu Cầu
- Đã cài Node.js (Phiên bản mới nhất)
- Đã cài MongoDB (Local hoặc MongoDB Atlas)
## CÁCH 1: Chạy Thủ Công (Khuyên dùng khi phát triển)
### Bước 1: Clone Project
```
git clone https://github.com/....../clothing-web.git
cd clothing-web
```
## Bước 2: Cài đặt & Chạy Backend
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
## Backend chạy tại:
http://localhost:5000
## Bước 3: Cài đặt & Chạy Frontend
Mở terminal mới:
```
cd cheese-clothing
npm install
npm run dev
```
## Frontend chạy tại (thường là):
http://localhost:5173
# V. Chức Năng Chính
## 1. Người Dùng
Bước 1: Người dùng truy cập website
       
Bước 2: Đăng ký / Đăng nhập tài khoản

Bước 3: Xem danh sách sản phẩm
            
Bước 4: Xem chi tiết sản phẩm

Bước 5: Thêm sản phẩm vào giỏ hàng
            
Bước 6: Thực hiện đặt hàng
            
Bước 7: Hệ thống lưu đơn hàng vào cơ sở dữ liệu
            
Bước 8: Người dùng xem lịch sử đơn hàng

### Lưu ý: Người dùng chỉ có thể đặt hàng khi đã đăng nhập.

## 2. Admin
Bước 1: Admin đăng nhập hệ thống

Bước 2: Hệ thống kiểm tra quyền Admin (JWT + role)

Bước 3: Truy cập trang quản trị

Bước 4: Thực hiện các chức năng:
- Quản lý sản phẩm (Thêm / Sửa / Xóa)
- Xem danh sách đơn hàng
- Cập nhật trạng thái đơn hàng
- Xem danh sách người dùng
Bước 5: Dữ liệu được cập nhật vào MongoDB và phản hồi về Frontend
## 3. Phân Quyền Người Dùng
```
Vai trò	     Quyền
User         Mua hàng, đặt đơn
Admin	     Quản lý toàn bộ hệ thống
```
## 4. Cấu Trúc Thư Mục
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
