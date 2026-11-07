import { Link } from 'react-router-dom';
import {
  useCartStore,
  selectTotalPrice,
  selectTotalItems,
} from '../store/cartStore';

export function Cart() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clearCart = useCartStore((state) => state.clear);

  const totalPrice = useCartStore(selectTotalPrice);
  const totalItems = useCartStore(selectTotalItems);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="status-box status-empty">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>You have not added any products to your shopping cart yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Browse Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-description">
          Review your chosen items ({totalItems} {totalItems === 1 ? 'item' : 'items'}).
        </p>
      </div>

      <div className="cart-layout">
        <div className="cart-items-list">
          {items.map((item) => (
            <div key={item.id} className="cart-item-row">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="cart-item-thumbnail"
              />

              <div className="cart-item-details">
                <Link to={`/products/${item.id}`} className="cart-item-title">
                  {item.title}
                </Link>
                <p className="cart-item-unit-price">
                  Unit Price: ${Number(item.price).toFixed(2)}
                </p>
              </div>

              <div className="cart-item-quantity-controls">
                <button
                  type="button"
                  className="btn-qty"
                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.id, e.target.value)}
                  className="qty-input"
                  aria-label={`Quantity of ${item.title}`}
                />
                <button
                  type="button"
                  className="btn-qty"
                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                <span className="subtotal-label">Subtotal:</span>
                <span className="subtotal-amount">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeItem(item.id)}
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary-card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total Items:</span>
            <strong>{totalItems}</strong>
          </div>
          <div className="summary-row summary-total">
            <span>Estimated Total:</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>

          <div className="summary-actions">
            <button
              type="button"
              className="btn btn-primary btn-full btn-lg"
              onClick={() => alert('Order placed! (Simulated checkout)')}
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              className="btn btn-outline btn-full"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <Link to="/products" className="btn btn-secondary btn-full">
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
