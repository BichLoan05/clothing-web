import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Khôi phục đăng nhập khi F5
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const register = async (username, password) => {
    try {
      await axiosClient.post("/auth/register", { username, password });
      toast.success("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(msg);
      return false;
    }
  };

  const login = async (username, password) => {
    try {
      const data = await axiosClient.post("/auth/login", { username, password });
      const userData = data.user || data; 

      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      
      toast.success(`Xin chào ${userData.username}`);
      
      if (userData.role === "admin") {
         navigate("/admin"); 
      } else {
         navigate("/");
      }
    } catch (error) {
      const msg = error.response?.data?.message;
      toast.error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast.info("Đã đăng xuất");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};