import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(lowerTerm));
        setDisplayedProducts(filtered);
      } else {
        setDisplayedProducts(products);
      }
    }, [products, searchTerm]);

  return (
    <div>
      <header className="home_header_banner">
        <div className="home_header_content">
          <h1 className="home_header_title">Cheese Clothing</h1>
          <p className="home_header_subtitle">Thời trang Cheese Cheese</p>
        </div>
      </header>
      
      <section className="home_products_section">
        <div className="home_products_grid">
          {/* --- SỬA LỖI Ở ĐÂY --- */}
          {displayedProducts.length > 0 ? (
            // Bỏ dấu { thừa ở đây
            displayedProducts.map((product) => (
              <div key={product.id} className="product_card_container">
                {/* Ảnh sản phẩm */}
                <img className="product_card_image" src={product.image} alt={product.name} />
                
                {/* Thông tin sản phẩm */}
                <div className="product_card_body">
                  <h5 className="product_card_name">{product.name}</h5>
                  <div className="product_card_reviews">⭐⭐⭐⭐⭐</div>
                  <div className="product_card_price_row">
                     <span className="product_card_old_price">{(product.price * 1.2).toLocaleString()} đ</span>
                     <span className="product_card_price">{product.price.toLocaleString()} đ</span>
                  </div>
                </div>

                {/* Nút bấm (Footer) - Phải nằm TRONG vòng lặp và TRONG thẻ div container */}
                <div className="product_card_footer">
                  <button 
                    className="product_btn btn_view"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Xem chi tiết
                  </button>
                  <button 
                    className="product_btn btn_cart"
                    onClick={() => addToCart(product)}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Phần else nằm ở đây
            <p style={{textAlign: 'center', width: '100%', gridColumn: '1/-1'}}>
                Không tìm thấy sản phẩm nào phù hợp.
            </p>
          )}
          {/* --- HẾT PHẦN SỬA --- */}
        </div>
      </section>

      {/* --- MODAL CHI TIẾT SẢN PHẨM (Giữ nguyên) --- */}
      {selectedProduct && (
        <div className="modal_overlay">
          <div className="product_detail_modal">
            <button className="modal_close_x" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="product_detail_content">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="product_detail_img" />
              <div className="product_detail_info">
                <h2>{selectedProduct.name}</h2>
                <p className="product_detail_price">{selectedProduct.price.toLocaleString()} VND</p>
                <p><strong>Size:</strong> {selectedProduct.size || 'Freesize'}</p>
                <p><strong>Còn lại:</strong> {selectedProduct.quantity || 0} sản phẩm</p>
                <p className="product_detail_desc">{selectedProduct.description}</p>
                <button 
                  className="product_add_to_cart_button full_width"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;