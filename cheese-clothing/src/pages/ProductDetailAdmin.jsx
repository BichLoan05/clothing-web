import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

const ProductDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);

    // 1. Log ra xem ID trên thanh địa chỉ là gì
  console.log("ID từ URL:", id); 
  console.log("Danh sách SP:", products);

  // 2. Tìm kiếm (Bỏ Number, so sánh chuỗi)
  // So sánh với p.id HOẶC p._id để chắc chắn tìm thấy
  const product = products.find((p) => String(p.id) === id || String(p._id) === id);

  if (!product) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Không tìm thấy sản phẩm</h2>
        <button onClick={() => navigate("/admin/products")}>Quay lại</button>
      </div>
    );
  }

  const stockStatus = product.quantity > 0 ? "Còn hàng" : "Hết hàng";
  const stockColor = product.quantity > 0 ? "green" : "red";

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/admin")}
        style={{ marginBottom: 20, padding: "8px 16px", cursor: "pointer" }}
      >
        ← Quay lại danh sách
      </button>

      <h2 style={{ marginBottom: 20 }}>CHI TIẾT SẢN PHẨM</h2>

      <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              objectFit: "cover",
            }}
          />
        )}

        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <tbody>
            <Row label="Mã sản phẩm" value={`#${product.id}`} />
            <Row label="Tên sản phẩm" value={product.name} />
            <Row label="Giá bán" value={`${product.price.toLocaleString()} ₫`} />
            <Row label="Size" value={product.size || "Free Size"} />
            <Row label="Tồn kho" value={`${product.quantity} (${stockStatus})`} valueColor={stockColor} />
            <Row label="Ngày tạo" value={product.createdAt} />
            <Row label="Cập nhật lần cuối" value={product.updatedAt} />
            <Row label="Mô tả" value={product.description || "Chưa có mô tả"} isDesc />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Row = ({ label, value, isDesc, valueColor }) => (
  <tr>
    <td
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        fontWeight: "bold",
        width: "180px",
        background: "#f5f5f5",
        verticalAlign: "top",
      }}
    >
      {label}
    </td>
    <td
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        color: valueColor || "#333",
        lineHeight: isDesc ? "1.6" : "normal",
      }}
    >
      {value}
    </td>
  </tr>
);

export default ProductDetailAdmin;
