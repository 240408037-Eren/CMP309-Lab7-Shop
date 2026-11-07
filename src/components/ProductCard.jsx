import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-wrapper">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="product-thumbnail"
          />
          <span className="product-category-tag">{product.category}</span>
        </div>
        <div className="product-card-body">
          <h3 className="product-title" title={product.title}>
            {product.title}
          </h3>
          <p className="product-price">${Number(product.price).toFixed(2)}</p>
        </div>
      </Link>
      <div className="product-card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-full"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
