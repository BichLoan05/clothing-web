import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor: Xử lý dữ liệu trả về cho gọn
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Có thể xử lý lỗi chung ở đây (ví dụ: token hết hạn thì logout)
    throw error;
  }
);

export default axiosClient;