import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="login_page_container">
      <div className="login_form_wrapper">
        <h2 className="login_title">ĐĂNG NHẬP</h2>
        <form className="login_form" onSubmit={handleSubmit}>
          <div className="login_form_group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              className="login_input_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          <div className="login_form_group">
            <label>Mật khẩu</label>
            <input
              type="password"
              className="login_input_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button type="submit" className="login_submit_button">
            Đăng nhập
          </button>
        </form>

        <p className="login_footer">
          Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
        </p> 
      </div>
    </div>
  );
};

export default Login;