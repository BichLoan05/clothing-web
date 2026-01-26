import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/product-card.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="product_card_container">
      <img className="product_card_image" src={product.image} alt={product.name} />
      <div className="product_card_body">
        <h5 className="product_card_name">{product.name}</h5>
        <div className="product_card_reviews">⭐⭐⭐⭐⭐</div>
        <span className="product_card_price">{formatPrice(product.price)}</span>
      </div>
      <div className="product_card_footer">
        <button 
          className="product_add_to_cart_button"
          onClick={() => addToCart(product)}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;