function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="product-category">{product.category}</p>
      <p className="product-price">₹{product.price}</p>
      <p>Quantity: {product.qty}</p>
    </div>
  );
}

export default ProductCard;