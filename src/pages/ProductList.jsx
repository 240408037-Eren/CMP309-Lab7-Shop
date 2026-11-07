import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../api/productsApi';
import { useFetch } from '../hooks/useFetch';
import { ProductCard } from '../components/ProductCard';

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Stable fetch callback
  const fetchProductsCallback = useCallback((signal) => fetchProducts(signal), []);
  const { loading, error, data: products } = useFetch(fetchProductsCallback, []);

  // Read current filter values directly from the URL query string
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'all';

  // Derive unique categories from loaded products during render
  const categories = useMemo(() => {
    if (!products) return ['all'];
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ['all', ...unique.sort()];
  }, [products]);

  // Derive filtered products directly during render (NEVER in state or effect)
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        !normalizedQuery || product.title.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  // Handlers that update URL query params while preserving the other parameter
  const handleSearchChange = (e) => {
    const nextQuery = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (nextQuery.trim()) {
      newParams.set('q', nextQuery);
    } else {
      newParams.delete('q');
    }

    setSearchParams(newParams, { replace: true });
  };

  const handleCategoryChange = (e) => {
    const nextCategory = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (nextCategory && nextCategory !== 'all') {
      newParams.set('category', nextCategory);
    } else {
      newParams.delete('category');
    }

    setSearchParams(newParams, { replace: true });
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="product-list-page">
      <div className="catalog-header">
        <h1 className="page-title">Product Catalogue</h1>
        <p className="page-description">
          Browse through our full inventory. Filter by title or category in real-time.
        </p>

        <div className="filter-controls">
          <div className="search-field">
            <label htmlFor="search-input" className="visually-hidden">
              Search Products
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Search by product title..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-input search-input"
            />
          </div>

          <div className="category-field">
            <label htmlFor="category-select" className="visually-hidden">
              Filter by Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="form-select category-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              className="btn btn-outline btn-clear"
              onClick={handleClearFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Explicit Loading State */}
      {loading && (
        <div className="status-box status-loading" role="status">
          <div className="spinner"></div>
          <p>Loading catalogue products...</p>
        </div>
      )}

      {/* Explicit Error State */}
      {error && !loading && (
        <div className="status-box status-error" role="alert">
          <h3>Failed to Load Products</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Explicit Empty State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="status-box status-empty">
          <h3>No Matching Products</h3>
          <p>We couldn't find any products matching your current filters.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <section className="products-grid" aria-label="Products Catalogue">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
}
