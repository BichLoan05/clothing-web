import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const HomeAdmin = () => {
  const { products } = useContext(ProductContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="home_header_banner">
        <h1 className="home_header_title">Cheese Clothing</h1>
        <p className="home_header_subtitle">Thời trang Cheese Cheese</p>
      </div>

      <div className="home_products_section">
        <div className="home_products_grid">
          {products.map((product) => (
            <div className="product_card_container" key={product.id}>
              
              <img
                src={product.image}
                alt={product.name}
                className="product_card_image"
              />

              {/* BODY */}
              <div className="product_card_body">
                <h5 className="product_card_name">{product.name}</h5>
                <div className="product_card_reviews">⭐⭐⭐⭐⭐</div>

                <div className="product_card_price_row">
                  <span className="product_card_old_price">
                    {(product.price * 1.2).toLocaleString()} đ
                  </span>
                  <span className="product_card_price">
                    {product.price.toLocaleString()} đ
                  </span>
                </div>
              </div>

              {/* FOOTER – CHỈ CÓ XEM CHI TIẾT */}
              <div className="product_card_footer">
                <button
                  className="product_btn"
                  onClick={() => navigate(`/admin/detail/${product.id || product._id}`)}
                >
                  Xem chi tiết
                </button>
                

                <button
                  className = "product_btn"
                  onClick={() => navigate(`/admin/product/${product.id}`)}
                >
                  Quản lý
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeAdmin;
