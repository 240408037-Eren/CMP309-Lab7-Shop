const BASE_URL = 'https://dummyjson.com/products';

/**
 * Fetches the catalogue of products from DummyJSON API.
 * Accepts an AbortSignal for request cancellation.
 */
export async function fetchProducts(signal) {
  const response = await fetch(`${BASE_URL}?limit=100`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch products (HTTP ${response.status})`);
  }

  const data = await response.json();
  return data.products;
}

/**
 * Fetches a single product by its id.
 * Accepts an AbortSignal for request cancellation.
 */
export async function fetchProduct(id, signal) {
  const response = await fetch(`${BASE_URL}/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Product #${id} not found (HTTP ${response.status})`);
  }

  const product = await response.json();
  return product;
}
