import { useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProduct } from '../api/productsApi';
import { useFetch } from '../hooks/useFetch';
import { useCartStore } from '../store/cartStore';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // Re-fetch whenever :id changes
  const fetchProductCallback = useCallback(
    (signal) => fetchProduct(id, signal),
    [id]
  );

  const { loading, error, data: product } = useFetch(fetchProductCallback, [id]);

  const handleBack = () => {
    navigate('/products');
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="detail-navigation">
        <button type="button" onClick={handleBack} className="btn btn-outline btn-back">
          ← Back to Catalogue
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="status-box status-loading" role="status">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      )}

      {/* Error state (e.g. invalid or unknown ID) */}
      {error && !loading && (
        <div className="status-box status-error" role="alert">
          <h2>Product Not Found</h2>
          <p>{error}</p>
          <p className="status-hint">
            The requested product with ID #{id} does not exist or could not be loaded.
          </p>
          <Link to="/products" className="btn btn-primary">
            Return to Catalogue
          </Link>
        </div>
      )}

      {/* Loaded Product Details */}
      {!loading && !error && product && (
        <article className="product-detail-card">
          <div className="detail-media">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="detail-thumbnail"
            />
          </div>

          <div className="detail-info">
            <span className="product-category-tag">{product.category}</span>
            <h1 className="detail-title">{product.title}</h1>
            <p className="detail-price">${Number(product.price).toFixed(2)}</p>

            <div className="detail-description-block">
              <h3>Description</h3>
              <p className="detail-description">{product.description}</p>
            </div>

            {product.rating && (
              <p className="detail-rating">
                ⭐ <strong>{product.rating}</strong> / 5
              </p>
            )}

            {product.stock !== undefined && (
              <p className="detail-stock">
                📦 In Stock: <strong>{product.stock}</strong> units
              </p>
            )}

            <div className="detail-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-secondary btn-lg">
                View Cart
              </Link>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
